<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api/axios";
import { useAuthStore } from "../stores/auth";
import { Notyf } from "notyf";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const notyf = new Notyf();

const postId = route.params.id; // present if editing

const title = ref("");
const content = ref("");
const loading = ref(false);
const isEditMode = ref(false);

// Check if editing
onMounted(async () => {
  if (postId) {
    isEditMode.value = true;
    loading.value = true;

    try {
      const res = await api.get(`/posts/${postId}`);
      title.value = res.data.title;
      content.value = res.data.content;
    } catch (err) {
      console.error(err);
      notyf.error("Failed to load post.");
    } finally {
      loading.value = false;
    }
  }
});

// Submit handler for create/update
const savePost = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    return notyf.error("Title and content cannot be empty.");
  }

  loading.value = true;

  try {
    if (isEditMode.value) {
      await api.patch(`/posts/${postId}`, {
        title: title.value,
        content: content.value,
      });
      notyf.success("Post updated successfully.");
    } else {
      await api.post("/posts", {
        title: title.value,
        content: content.value,
      });
      notyf.success("Post created successfully.");
    }
    router.push("/");
  } catch (err) {
    console.error(err);
    if (err.response?.data?.message) {
      notyf.error(err.response.data.message);
    } else {
      notyf.error("Error saving post.");
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="post-form container my-4">
    <h1 class="mb-4">{{ isEditMode ? "Edit Post" : "Create New Post" }}</h1>

    <div v-if="loading" class="text-center my-3">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <form v-else @submit.prevent="savePost" class="card shadow-sm p-4">
      <div class="mb-3">
        <label class="form-label">Title</label>
        <input v-model="title" type="text" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Content</label>
        <textarea v-model="content" rows="6" class="form-control" required></textarea>
      </div>

      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ isEditMode ? "Update Post" : "Publish Post" }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.post-form {
  max-width: 700px;
  margin: auto;
}
</style>

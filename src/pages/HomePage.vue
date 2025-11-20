<script setup>
import { onMounted } from 'vue';
import { usePostStore } from '../stores/post';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';

const postStore = usePostStore();
const authStore = useAuthStore();
const router = useRouter();
const notyf = new Notyf();

onMounted(async () => {
  try {
    await postStore.fetchPosts();
  } catch {
    notyf.error('Failed to load posts');
  }
});

const viewPost = (id) => {
  router.push(`/post/${id}`);
};

const deletePost = async (id) => {
  if (!confirm('Are you sure you want to delete this post?')) return;
  try {
    await postStore.deletePost(id);
    await postStore.fetchPosts();
    notyf.success('Post deleted successfully.');
  } catch {
    notyf.error('Failed to delete post.');
  }
};

const goEditPost = (id) => {
  router.push(`/post/edit/${id}`);
};
</script>

<template>
  <div class="container my-4">
    <h1 class="mb-4 text-center">B581- Tweets</h1>

    <!-- New Post button -->
    <div v-if="authStore.user" class="mb-4 text-end">
      <button class="btn btn-gradient" @click="$router.push('/post/new')">+ New Post</button>
    </div>

    <!-- Loading -->
    <div v-if="postStore.isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <!-- Posts Feed -->
    <div class="row">
      <div v-for="p in postStore.posts" :key="p._id" class="col-md-6 col-lg-4 mb-4">
        <div class="card post-card shadow-sm h-100 p-3 d-flex flex-column">
          <!-- Header -->
          <div class="d-flex align-items-center mb-2">
            <img :src="`https://i.pravatar.cc/50?u=${p.author._id}`" alt="avatar" class="avatar me-2"/>
            <div>
              <strong class="username">{{ p.author.username }}</strong>
              <span class="text-muted small">@{{ p.author.username.toLowerCase() }} · {{ new Date(p.createdAt).toLocaleString() }}</span>
            </div>
          </div>

          <!-- Post content -->
          <p class="post-content flex-grow-1">{{ p.content }}</p>

          <!-- Actions -->
          <div class="d-flex gap-2 mt-3 flex-wrap">
            <button class="btn-action" @click="viewPost(p._id)">
              <i class="bi bi-eye"></i> Read More
            </button>

            <button
              v-if="authStore.user && (authStore.user.id === p.author._id || authStore.user.isAdmin)"
              class="btn btn-sm btn-outline-primary"
              @click="goEditPost(p._id)"
            >
              Edit
            </button>
            <button
              v-if="authStore.user && (authStore.user.id === p.author._id || authStore.user.isAdmin)"
              class="btn btn-sm btn-outline-danger"
              @click="deletePost(p._id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Post Card */
.post-card {
  border-radius: 15px;
  border-left: 5px solid #1da1f2;
  background: #fff;
}

/* Avatar */
.avatar {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  object-fit: cover;
}

/* Post content */
.post-content {
  white-space: pre-wrap;
  word-break: break-word;
  margin-top: 0.5rem;
}

/* Buttons */
.btn-action {
  background: transparent;
  border: none;
  color: #1da1f2;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}
.btn-action i {
  font-size: 1em;
}

/* Gradient button for new post */
.btn-gradient {
  background: linear-gradient(135deg, #1da1f2, #0d8ddb);
  color: white;
  border: none;
  padding: 7px 15px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-gradient:hover {
  opacity: 0.85;
}
</style>

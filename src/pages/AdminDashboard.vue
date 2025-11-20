<template>
  <div class="admin-dashboard d-flex">

    <!-- Left Sidebar -->
    <aside class="sidebar d-flex flex-column align-items-start p-3">
      <h2 class="mb-4">Admin</h2>
      <button class="btn-sidebar mb-3" @click="router.push('/admin')">
        <i class="bi bi-speedometer2"></i> Dashboard
      </button>
      <button class="btn-sidebar mb-3" @click="router.push('/')">
        <i class="bi bi-house"></i> Home
      </button>
      <button v-if="authStore.user" class="btn-gradient mt-auto" @click="$router.push('/post/new')">
        + New Post
      </button>
    </aside>

    <!-- Main Feed -->
    <main class="feed flex-grow-1 p-4">
      <h1 class="mb-4">All Blog Posts</h1>

      <div v-if="postStore.isLoading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-for="p in postStore.posts" :key="p._id" class="card post-card mb-3 p-3 shadow-sm">
        <!-- Header -->
        <div class="d-flex align-items-center mb-2">
          <img :src="`https://i.pravatar.cc/50?u=${p.author._id}`" class="avatar me-2" />
          <div>
            <strong class="username">{{ p.author.username }}</strong>
            <span class="text-muted small">@{{ p.author.username.toLowerCase() }} · {{ new Date(p.createdAt).toLocaleString() }}</span>
          </div>
        </div>

        <!-- Content -->
        <p class="post-content">{{ p.content }}</p>

        <!-- Actions -->
        <div class="d-flex gap-2 flex-wrap mt-3">
          <button class="btn-action" @click="viewPost(p._id)">
            <i class="bi bi-eye"></i> View
          </button>
          <button class="btn btn-sm btn-outline-primary" @click="goEditPost(p._id)">
            Edit
          </button>
          <button class="btn btn-sm btn-outline-danger" @click="deletePost(p._id)">
            Delete
          </button>
        </div>
      </div>
    </main>

    <!-- Right Sidebar (optional stats) -->
    <aside class="sidebar-right p-3 d-none d-lg-flex flex-column">
      <h5>Stats</h5>
      <p>Total Posts: {{ postStore.posts.length }}</p>
      <p>Total Users: Placeholder</p>
    </aside>

  </div>
</template>

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

const viewPost = (id) => router.push(`/post/${id}`);
const goEditPost = (id) => router.push(`/post/edit/${id}`);
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
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: #e6ecf0;
}

/* Left Sidebar */
.sidebar {
  width: 200px;
  background: #fff;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

.btn-sidebar {
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  color: #1da1f2;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  cursor: pointer;
  font-weight: 600;
}
.btn-sidebar:hover {
  background: #f0f8ff;
}

/* Right Sidebar */
.sidebar-right {
  width: 220px;
  background: #fff;
  border-left: 1px solid #ccc;
}

/* Feed */
.feed {
  flex-grow: 1;
}

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

/* Gradient Button */
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

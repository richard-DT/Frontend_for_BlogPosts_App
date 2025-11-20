<script setup>
import { useAuthStore } from '../stores/auth';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Get first part of email as username
const firstName = computed(() => {
  if (!authStore.user || !authStore.user.email) return '';
  return authStore.user.email.split('@')[0];
});

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light px-3">
    <a class="navbar-brand d-flex align-items-center" @click.prevent="$router.push('/')">
      <img src="/cube.png" alt="logo" width="50" height="50" class="me-2" />
      B581-Tweets
    </a>


    <div class="ms-auto d-flex align-items-center gap-2">
      <!-- Admin Dashboard Link -->
      <button
        v-if="authStore.user?.isAdmin"
        class="btn btn-outline-warning btn-sm"
        @click="$router.push('/admin')"
      >
        Admin Dashboard
      </button>

      <!-- Greeting & Logout -->
      <span v-if="authStore.user" class="me-2">Hello, {{ firstName }}!</span>
      <button
        v-if="authStore.user"
        class="btn btn-outline-danger btn-sm"
        @click="logout"
      >
        Logout
      </button>

      <!-- Login/Register -->
      <div v-else>
        <button class="btn btn-outline-primary btn-sm" @click="$router.push('/login')">
          Login
        </button>
        <button class="btn btn-primary btn-sm ms-2" @click="$router.push('/register')">
          Register
        </button>
      </div>
    </div>
  </nav>
</template>


<style scoped>
.navbar-brand img {
  border-radius: 50%;
}
</style>

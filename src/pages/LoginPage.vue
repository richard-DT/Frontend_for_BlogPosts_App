<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Notyf } from 'notyf';

const authStore = useAuthStore();
const router = useRouter();
const notyf = new Notyf();

const email = ref('');
const password = ref('');

const submitLogin = async () => {
  const result = await authStore.login(email.value, password.value);
  if (result === true) {
    notyf.success('Login successful');
    router.push('/');
  } else {
    notyf.error(result);
  }
};
</script>

<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm p-4">
          <h3 class="mb-4 text-center">Login</h3>
          <div class="mb-3">
            <label>Email</label>
            <input type="email" v-model="email" class="form-control" />
          </div>
          <div class="mb-3">
            <label>Password</label>
            <input type="password" v-model="password" class="form-control" />
          </div>
          <button class="btn btn-primary w-100" :disabled="authStore.isLoading" @click="submitLogin">
            <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
            Login
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

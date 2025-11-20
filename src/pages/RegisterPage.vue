<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Notyf } from 'notyf';

const authStore = useAuthStore();
const router = useRouter();
const notyf = new Notyf();

const username = ref('');
const email = ref('');
const password = ref('');

const submitRegister = async () => {
  const result = await authStore.register(username.value, email.value, password.value);
  if (result === true) {
    notyf.success('Registration successful');
    router.push('/login');
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
          <h3 class="mb-4 text-center">Register</h3>
          <div class="mb-3">
            <label>Username</label>
            <input v-model="username" class="form-control" />
          </div>
          <div class="mb-3">
            <label>Email</label>
            <input v-model="email" class="form-control" />
          </div>
          <div class="mb-3">
            <label>Password</label>
            <input type="password" v-model="password" class="form-control" />
          </div>
          <button class="btn btn-success w-100" :disabled="authStore.isLoading" @click="submitRegister">
            <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
            Register
          </button>

        </div>
      </div>
    </div>
  </div>
</template>

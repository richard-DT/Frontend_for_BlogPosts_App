import { defineStore } from 'pinia';
import api from '../api/axios';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || '');
  const isLoading = ref(false);

  const login = async (email, password) => {
    isLoading.value = true;
    try {
      const res = await api.post('/user/login', { email, password });
      token.value = res.data.token;
      localStorage.setItem('token', token.value);

      user.value = JSON.parse(atob(token.value.split('.')[1]));
      return true;
    } catch (err) {
      return err.response?.data?.message || 'Login failed';
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
  };

  const register = async (username, email, password) => {
    isLoading.value = true;
    try {
      await api.post('/user/register', { username, email, password });
      return true;
    } catch (err) {
      return err.response?.data?.message || 'Registration failed';
    } finally {
      isLoading.value = false;
    }
  };

  return { user, token, isLoading, login, logout, register };
});

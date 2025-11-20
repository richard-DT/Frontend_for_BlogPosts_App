import { defineStore } from 'pinia';
import api from '../api/axios';
import { ref } from 'vue';

export const usePostStore = defineStore('post', () => {
  const posts = ref([]);
  const post = ref(null);
  const isLoading = ref(false);

  const fetchPosts = async () => {
    isLoading.value = true;
    try {
      const res = await api.get('/posts');
      posts.value = res.data;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchPost = async (id) => {
    isLoading.value = true;
    try {
      const res = await api.get(`/posts/${id}`);
      post.value = res.data;
    } finally {
      isLoading.value = false;
    }
  };

  const createPost = async (data) => {
    const res = await api.post('/posts', data);
    return res.data;
  };

  const updatePost = async (id, data) => {
    const res = await api.patch(`/posts/${id}`, data);
    return res.data;
  };

  const deletePost = async (id) => {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  };

  return { posts, post, isLoading, fetchPosts, fetchPost, createPost, updatePost, deletePost };
});

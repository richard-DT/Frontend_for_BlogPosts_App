import { defineStore } from 'pinia';
import api from '../api/axios';
import { ref } from 'vue';

export const useCommentStore = defineStore('comment', () => {
  const comments = ref([]);
  const isLoading = ref(false);

  const fetchComments = async (postId) => {
    isLoading.value = true;
    try {
      const res = await api.get(`/comments/${postId}`);
      comments.value = res.data;
    } finally {
      isLoading.value = false;
    }
  };

  const addComment = async (postId, content) => {
    const res = await api.post(`/comments/${postId}`, { content });
    return res.data;
  };

  const deleteComment = async (id) => {
    const res = await api.delete(`/comments/${id}`);
    return res.data;
  };

  return { comments, isLoading, fetchComments, addComment, deleteComment };
});

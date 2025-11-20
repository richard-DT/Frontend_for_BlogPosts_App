<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePostStore } from '../stores/post';
import { useCommentStore } from '../stores/comment';
import { useAuthStore } from '../stores/auth';
import { Notyf } from 'notyf';

const route = useRoute();
const router = useRouter();
const postStore = usePostStore();
const commentStore = useCommentStore();
const authStore = useAuthStore();
const notyf = new Notyf();

const loading = ref(true);
const newComment = ref('');
const commentBox = ref(null);
const postLikes = ref(0);

// Load post and comments
const loadData = async () => {
  loading.value = true;
  try {
    await postStore.fetchPost(route.params.id);
    await commentStore.fetchComments(route.params.id);
  } catch (err) {
    console.error(err);
    notyf.error('Failed to load post or comments');
  } finally {
    loading.value = false;
  }
};

// Comment actions
const submitComment = async () => {
  if (!newComment.value.trim()) return;
  try {
    await commentStore.addComment(route.params.id, newComment.value);
    newComment.value = '';
    await commentStore.fetchComments(route.params.id);
    notyf.success('Comment added');
  } catch (err) {
    console.error(err);
    notyf.error('Failed to add comment');
  }
};

const deleteComment = async (id) => {
  if (!confirm('Are you sure you want to delete this comment?')) return;
  try {
    await commentStore.deleteComment(id);
    await commentStore.fetchComments(route.params.id);
    notyf.success('Comment deleted');
  } catch (err) {
    console.error(err);
    notyf.error('Failed to delete comment');
  }
};

// Post actions
const goEditPost = () => {
  if (!postStore.post?._id) return;
  router.push(`/post/edit/${postStore.post._id}`);
};

const deletePost = async (id) => {
  if (!confirm('Are you sure you want to delete this post?')) return;
  try {
    await postStore.deletePost(id);
    notyf.success('Post deleted successfully');
    router.push('/');
  } catch (err) {
    console.error(err);
    notyf.error('Failed to delete post');
  }
};

const likePost = () => {
  postLikes.value++;
  notyf.success('You liked this post!');
};

const focusComment = () => {
  commentBox.value?.focus();
};

onMounted(loadData);
</script>

<template>
  <div class="container my-4">

    <!-- Loading Spinner -->
    <div v-if="loading || postStore.isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <!-- Post Card -->
    <div v-else-if="postStore.post" class="card post-card shadow-sm mb-4 p-3">
      <!-- Header -->
      <div class="d-flex align-items-center mb-2">
        <img :src="`https://i.pravatar.cc/50?u=${postStore.post.author._id}`" alt="avatar" class="avatar me-2"/>
        <div>
          <strong class="username">{{ postStore.post.author.username }}</strong>
          <span class="text-muted small">@{{ postStore.post.author.username.toLowerCase() }} · {{ new Date(postStore.post.createdAt).toLocaleString() }}</span>
        </div>
      </div>

      <!-- Content -->
      <p class="post-content">{{ postStore.post.content }}</p>

      <!-- Actions -->
      <div class="d-flex gap-3 mt-3 align-items-center flex-wrap">
        <button class="btn-action" @click="likePost">
          <i class="bi bi-heart"></i> {{ postLikes }}
        </button>
        <button class="btn-action" @click="focusComment">
          <i class="bi bi-chat"></i> Reply
        </button>
        <button
          v-if="authStore.user && (authStore.user.id === postStore.post.author._id || authStore.user.isAdmin)"
          class="btn btn-sm btn-outline-primary"
          @click="goEditPost"
        >
          Edit
        </button>
        <button
          v-if="authStore.user && (authStore.user.id === postStore.post.author._id || authStore.user.isAdmin)"
          class="btn btn-sm btn-outline-danger"
          @click="deletePost(postStore.post._id)"
        >
          Delete
        </button>
      </div>
    </div>

    <div v-else class="alert alert-warning">
      Post not found.
    </div>

    <!-- Comments Section -->
    <div v-if="postStore.post" class="comments-section mt-4">
      <h5 class="mb-3">Comments</h5>

      <div v-if="commentStore.isLoading" class="text-center my-3">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-for="c in commentStore.comments" :key="c._id" class="comment-card mb-3 d-flex">
        <img :src="`https://i.pravatar.cc/40?u=${c.author._id}`" alt="avatar" class="avatar me-2"/>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <strong class="username">{{ c.author.username }}</strong>
              <span class="text-muted small">@{{ c.author.username.toLowerCase() }} · {{ new Date(c.createdAt).toLocaleString() }}</span>
              <p class="comment-content">{{ c.content }}</p>
            </div>
            <button
              v-if="authStore.user && (authStore.user.id === c.author._id || authStore.user.isAdmin)"
              class="btn btn-sm btn-outline-danger"
              @click="deleteComment(c._id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Reply -->
      <div v-if="authStore.user" class="mt-3 d-flex flex-column">
        <textarea ref="commentBox" v-model="newComment" class="form-control mb-2" rows="2" placeholder="Add a comment..."></textarea>
        <button class="btn btn-gradient" @click="submitComment">Reply</button>
      </div>

      <div v-else class="mt-3 text-muted">Login to reply.</div>
    </div>
  </div>
</template>

<style scoped>
/* Post & Comment Cards */
.post-card, .comment-card {
  border-radius: 15px;
  background: #fff;
  padding: 15px;
}
.post-card {
  border-left: 5px solid #1da1f2;
}

/* Avatars */
.avatar {
  border-radius: 50%;
  object-fit: cover;
}
.post-card .avatar { width: 50px; height: 50px; }
.comment-card .avatar { width: 40px; height: 40px; }

/* Post content */
.post-content, .comment-content {
  white-space: pre-wrap;
  word-break: break-word;
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
  font-size: 1.1em;
}

/* Gradient button for reply */
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

import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import PostPage from '../pages/PostPage.vue';
import AdminDashboard from '../pages/AdminDashboard.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
  { path: '/post/:id', component: PostPage },
  { path: '/admin', component: AdminDashboard, meta: { requiresAdmin: true } },
  {
    path: '/post/new',
    component: () => import('../pages/PostFormPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/post/edit/:id',
    component: () => import('../pages/PostFormPage.vue'),
    meta: { requiresAuth: true }
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAdmin && (!auth.user || !auth.user.isAdmin)) {
    return next('/');
  }
  next();
});

export default router;

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  if (['/login'].includes(to.path))
    return;

  if (!userStore.isLoggedIn()) {
    return navigateTo('/login');
  }
});

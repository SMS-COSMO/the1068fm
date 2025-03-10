function isTokenExpired(expiresAtISO: string) {
  const expirationDate = new Date(expiresAtISO);
  return Date.now() >= expirationDate.getTime();
}

export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  if (['/login'].includes(to.path))
    return;

  if (
    !userStore.loggedIn
    || !userStore.accessToken
    || userStore.expiresAt && isTokenExpired(userStore.expiresAt)
  ) {
    return navigateTo('/login');
  }
});

import type { RouterOutput, TPermission } from '~~/types';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const loggedIn = ref(false);
  const accessToken = ref('');
  const id = ref('');
  const name = ref('');
  const permissions = ref<TPermission[]>([]);
  const expiresAt = ref<string>();

  const login = (data: RouterOutput['user']['login']) => {
    loggedIn.value = true;
    accessToken.value = data.accessToken;
    id.value = data.id;
    name.value = data.name ?? '';
    permissions.value = data.permissions ?? [];
    expiresAt.value = data.expiresAt;
  };

  const logout = () => {
    loggedIn.value = false;

    accessToken.value = '';
    id.value = '';
    name.value = '';
    permissions.value = [];
    expiresAt.value = undefined;
  };

  const isTokenExpired = (expiresAtISO: string) => {
    const expirationDate = new Date(expiresAtISO);
    return Date.now() >= expirationDate.getTime();
  };

  const isLoggedIn = () => {
    return loggedIn.value
      && accessToken.value
      && expiresAt.value
      && !isTokenExpired(expiresAt.value);
  };

  return {
    loggedIn,
    accessToken,
    id,
    name,
    permissions,
    expiresAt,
    login,
    logout,
    isLoggedIn,
  };
}, {
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      // One month
      maxAge: 30 * 24 * 60 * 60,
    }),
  },
});

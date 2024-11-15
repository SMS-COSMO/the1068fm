import { defineStore } from 'pinia';
import type { RouterOutput, TPermission } from '~~/types';

export const useUserStore = defineStore('user', () => {
  const loggedIn = ref(false);
  const accessToken = ref('');
  const id = ref('');
  const name = ref('');
  const permissions = ref<TPermission[]>([]);

  const login = (data: RouterOutput['user']['login']) => {
    loggedIn.value = true;
    accessToken.value = data.accessToken;
    id.value = data.id;
    name.value = data.name ?? '';
    permissions.value = data.permissions ?? [];
  };

  const logout = () => {
    loggedIn.value = false;

    accessToken.value = '';
    id.value = '';
    name.value = '';
    permissions.value = [];
  };

  return {
    loggedIn,
    accessToken,
    id,
    name,
    permissions,
    login,
    logout,
  };
}, {
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      // One month
      maxAge: 30 * 24 * 60 * 60,
    }),
  },
});

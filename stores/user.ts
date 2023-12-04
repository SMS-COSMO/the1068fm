import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const loggedIn = ref(false);
  const accessToken = ref('');
  const refreshToken = ref('');
  const userId = ref('');
  const autoArrange = ref<'day' | 'week'>('week');

  const login = (data: {
    accessToken: string
    refreshToken: string
    userId: string
  }) => {
    loggedIn.value = true;
    accessToken.value = data.accessToken;
    refreshToken.value = data.refreshToken;
    userId.value = data.userId;
  };

  const changeAutoArrange = (data: 'day' | 'week') => {
    autoArrange.value = data;
  };

  const logout = () => {
    loggedIn.value = false;
    accessToken.value = '';
    refreshToken.value = '';
    userId.value = '';
  };

  return {
    loggedIn,
    accessToken,
    refreshToken,
    userId,
    autoArrange,
    login,
    logout,
    changeAutoArrange,
  };
}, {
  persist: true,
});

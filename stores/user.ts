import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const loggedIn = ref(false);
  const accessToken = ref('');
  const refreshToken = ref('');
  const userId = ref('');
  const autoArrange = ref<'day' | 'week'>('week');
  const lastSubmission = ref<Date>();

  const login = (data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
  }) => {
    loggedIn.value = true;
    accessToken.value = data.accessToken;
    refreshToken.value = data.refreshToken;
    userId.value = data.userId;
  };

  const submit = () => {
    lastSubmission.value = new Date();
  };

  const canSubmit = () => {
    if (!lastSubmission.value)
      return true;
    return new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) > new Date(lastSubmission.value);
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
    lastSubmission,
    canSubmit,
    submit,
    login,
    logout,
    changeAutoArrange,
  };
}, {
  persist: {
    storage: persistedState.cookiesWithOptions({
      // One month
      maxAge: 30 * 24 * 60 * 60,
    }),
  },
});

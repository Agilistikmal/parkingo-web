export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: useCookie("token").value || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    logout() {
      useCookie("token").value = null;
    },
  },
});

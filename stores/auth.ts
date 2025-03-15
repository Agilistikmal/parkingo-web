import type { Response } from "~/lib/types/response";
import type { User } from "~/lib/types/user";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: useCookie("token").value || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    getCurrentUser: async (state) => {
      const res: Response<User> = await $fetch("/v1/users/me", {
        baseURL: useRuntimeConfig().public.apiBase,
        headers: {
          Authorization: "Bearer " + state.token,
        },
      });
      return res.data;
    },
  },
  actions: {
    logout() {
      useCookie("token").value = null;
    },
  },
});

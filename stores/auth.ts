import type { Response } from "~/lib/types/response";
import type { User } from "~/lib/types/user";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: useCookie("token").value || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    getCurrentUser: async (state) => {
      if (!state.token) {
        return null;
      }

      try {
        const res: Response<User> = await $fetch("/v1/users/me", {
          baseURL: useRuntimeConfig().public.apiBase,
          headers: {
            Authorization: "Bearer " + state.token,
          },
        });
        return res.data;
      } catch (error) {
        return null;
      }
    },
  },
  actions: {
    logout() {
      useCookie("token").value = null;
    },
  },
});

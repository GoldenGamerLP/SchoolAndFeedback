import { useUser } from "~/composables/auth";

export default defineNuxtRouteMiddleware((to, from) => {
    const user = useUser();
  
    if (user.value) {
      return navigateTo('/myaccount');
    }
  });
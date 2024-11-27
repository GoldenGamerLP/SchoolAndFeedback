
export default defineNuxtRouteMiddleware((to) => {
  const school = useCurrentSchool();

  if (!to.fullPath.includes("/schools")) return;
  
  if (!school.value) {
    return navigateTo("/");
  }
});
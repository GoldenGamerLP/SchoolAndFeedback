
import { useCurrentSchool } from "~/composables/school";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const routeId = to.params.schoolnumber;
  if (!routeId) return;

  const school = useCurrentSchool();
  try {
    const data = await useRequestFetch()("/api/v1/schools/getbyparams", {
      query: {
        schoolnumber: routeId,
      },
    });
    school.value = data;
  } catch (error) {
    school.value = null;
    console.error('Failed to load school:', error);
  }
});
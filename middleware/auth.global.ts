import { useUser } from "~/composables/auth";

export default defineNuxtRouteMiddleware(async () => {
	const user = useUser();
	const data = await useRequestFetch()("/api/v1/auth/user");
	if (data) {
		user.value = data;
	}
});
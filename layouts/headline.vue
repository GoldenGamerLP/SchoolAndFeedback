<template>
	<div class="min-h-screen flex flex-col z-10 relative">
		<nav class="flex flex-row items-center justify-between m-2 sticky top-0 z-[-1]">
			<div class="flex gap-4">
				<Icon name="mdi:school" class="text-6xl text-primary"></Icon>
				<div class="grid">
					<h1 class="text-xl font-bold">School And Feedback</h1>
					<h2 class="text-secondary-foreground">Schule - {{ school?.schulname || "Keine schule" }}</h2>
				</div>
			</div>
			<div class="flex space-x-2">
				<div class="items-center gap-2 hidden md:flex">
					<Avatar>
						<AvatarFallback>
							<Icon name="mdi:account" class="size-7 text-primary"></Icon>
						</AvatarFallback>
					</Avatar>
					{{ user?.displayname ?? "Logge dich ein" }}
				</div>
				<Popover>
					<PopoverTrigger as-child>
						<Button size="icon" variant="secondary">
							<Icon name="mdi:dots-vertical" class="size-7"></Icon>
						</Button>
					</PopoverTrigger>
					<PopoverContent>
						<ol class="flex flex-col [&>li:not(:last-child)]:border-b">
							<li>
								<ColorMode />
							</li>
							<li>
								<NuxtLink :to="`/schools/${school?.schulnummer}`">
									<Button variant="ghost" class="w-full">
										<Icon name="mdi:school" class="size-6"></Icon>
										Zurück zur Schule
									</Button>
								</NuxtLink>
							</li>
							<li v-if="user">
								<NuxtLink :to="`/api/v1/auth/actions/logout`">
									<Button variant="ghost" class="w-full">
										<Icon name="mdi:logout" class="size-6"></Icon>
										Logge dich aus
									</Button>
								</NuxtLink>
							</li>
							<li v-else>
								<NuxtLink :to="`/authentication`">
									<Button variant="ghost" class="w-full">
										<Icon name="mdi:login" class="size-7"></Icon>
										Logge dich ein
									</Button>
								</NuxtLink>
							</li>
						</ol>
					</PopoverContent>
				</Popover>
			</div>
		</nav>
		<slot />
	</div>
</template>

<script lang="ts" setup>
const school = useCurrentSchool();
const user = useUser();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
	{
	opacity: 0;
}
</style>

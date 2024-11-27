<template>
    <main class="min-h-svh relative flex flex-col">
        <div class="absolute inset-0 -z-10">
            <div class="w-full h-full bg-primary/80 transition-all transform-gpu"
                :style="{ clipPath, transitionDuration: '2.1s' }"></div>
        </div>
        <header class="flex w-full p-4 bg-card/30 backdrop-blur-3xl shadow-md border-b">
            <h1 class="text-2xl font-bold text-primary flex items-center">
                <Icon name="mdi:school" class="mr-2 text-rpimary size-8" />
                School and Feedback
            </h1>
            <Button variant="default" class="ml-auto mr-2">Get Started</Button>
            <Button variant="secondary">Sign In</Button>
        </header>
        <div class="flex-1 flex justify-center items-center backdrop-blur-3xl flex-col">
            <!-- Text content container with explicit width -->
            <div class="w-full max-w-xl px-4">
                <Icon name="mdi:school" class="text-primary size-16" />
                <h2 class="text-4xl font-bold text-primary">Willkommen bei Schule und Feedback</h2>
                <p class="text-lg text-foreground/70">
                    Tausche Feedback, Änderungen und Vorschläge mit deiner Schule aus.
                </p>
            </div>

            <!-- Search container matching the width above -->
            <div class="relative mt-8 w-full max-w-xl px-4">
                <div class="relative">
                    <Input id="search" type="text" placeholder="Nach Schulen suchen..." class="w-full pl-10 pr-4"
                        @focus="isSearchOpen = true" v-model="search" autocomplete="off" aria-autocomplete="list"
                        aria-controls="search-results" :aria-expanded="isSearchOpen" aria-haspopup="listbox" />
                    <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                        <Icon name="mdi:magnify" class="size-7 text-muted-foreground" />
                    </span>
                    <span class="absolute end-0 inset-y-0 flex items-center justify-center px-2"
                        v-if="status === 'loading'">
                        <Icon name="mdi:loading" class="size-7 text-muted-foreground animate-spin" />
                    </span>
                </div>
                <!-- Search results dropdown -->
                <div class="absolute inset-x-0 px-4" v-if="isSearchOpen" ref="dropdown">
                    <ul class="max-h-64 overflow-y-auto mt-2" style="scrollbar-width: thin" aria-live="polite"
                        aria-relevant="additions">
                        <li v-for="school in searchSchools" :key="school">
                            <NuxtLink :to="`/schools/${school.schulnummer}`">
                                <div class="flex items-center border-b border-muted-foreground">
                                    <Avatar>
                                        <AvatarFallback>
                                            <Icon name="mdi:school" class="size-8 text-primary" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div class="ml-2">
                                        <h3 class="text-lg font-bold text-primary">{{ school.schulname }}</h3>
                                        <p class="text-foreground/70">{{ school.schulnummer }} - {{ school.ort
                                            }}</p>
                                    </div>
                                </div>
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </main>
</template>

<script lang="js" setup>
import { ref, onMounted } from 'vue';
import { refDebounced, onClickOutside } from '@vueuse/core';

const dropdown = ref(null);
const search = refDebounced('', 900, { maxWait: 2000 });
const isSearchOpen = ref(false);
const clipPath = ref('polygon(0 0, 10% 0, 10% 10%, 0 10%)');

onClickOutside(dropdown, () => isSearchOpen.value = false);

const { data: searchSchools, status } = useFetch("/api/v1/schools/get", {
    query: { search },
    immediate: false,
    watch: [search]
});

onMounted(() => {
    setInterval(() => {
        clipPath.value = `polygon(${Math.random() * 80}% ${Math.random() * 80}%, ${Math.random() * 80}% ${Math.random() * 80}%, ${Math.random() * 80}% ${Math.random() * 80}%, ${Math.random() * 80}% ${Math.random() * 80}%)`;
    }, 2050);
});
</script>
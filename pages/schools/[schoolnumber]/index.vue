<template>
     <main class="flex-1 bg-card text-card-foreground p-4 rounded-t-xl border-t flex flex-col flex-1">
        <ol class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <li v-for="module in options.options.enabledModules" :key="module.route">
                <NuxtLink :to="`/schools/${school.schulnummer}/${module.route}`">
                    <div class="bg-muted rounded-lg border-2 border-muted-foreground/50 p-4 gap-2">
                        <div class="flex items-cente justify-center">
                            <Icon :name="module.icon" class="text-4xl text-primary/50"></Icon>
                        </div>
                        <div class="flex items-center flex-col">
                            <p class="text-lg text-center">{{ module.name }}</p>
                            <p class="text-sm text-muted-foreground">{{ module.description }}</p>
                        </div>
                    </div>
                </NuxtLink>
            </li>
        </ol>
    </main>
</template>

<script lang="js" setup>
const school = useCurrentSchool();

definePageMeta({
    layout: 'headline',
});

useSeoMeta({
    title: () => `${school.value.schulname} - Module`,
})

const { data: options } = await useFetch("/api/v1/schools/options", {
    query: { schoolnumber: school.value.schulnummer },
})
</script>
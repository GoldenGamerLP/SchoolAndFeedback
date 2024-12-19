<template>
     <div class="bg-card/50 text-card-foreground p-4 flex-1 rounded-t-xl border-t">
        <header class="flex gap-4">
            <NuxtLink :to="`/schools/${school.schulnummer}`">
                <Button size="icon" variant="secondary">
                    <Icon name="mdi:arrow-left"></Icon>
                    <span class="sr-only">Zurück</span>
                </Button>
            </NuxtLink>
            <div>
                <h1 class="text-xl font-bold">Informationen</h1>
                <p class="text-muted-foreground flex items-center gap-2">
                    Hier siehst du alle Informationen zur Schule
                    <span class="text-primary">{{ school.schulname }}</span>.
                </p>
            </div>
        </header>
        <main class="grid md:grid-cols-2 gap-4 mt-4">
            <Card v-for="information in Object.keys(school).filter(key => key !== '_id')" :key="information">
                <CardHeader>
                    <CardTitle class="capitalize">{{ information }}</CardTitle>
                </CardHeader>
              <CardContent>
                <p>{{ school[information] }}</p>
              </CardContent>
            </Card>
        </main>
    </div>
</template>

<script lang="js" setup>
const school = useCurrentSchool();

definePageMeta({
    layout: 'headline',
});

useSeoMeta({
    title: () => `${school.value.schulname} - Informationen`,
})
</script>
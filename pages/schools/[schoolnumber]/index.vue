<template>
  <main class="bg-card/50 text-card-foreground p-4 rounded-t-xl border-t flex flex-col flex-1">
    <template v-if="isSchoolEnabled">
      <h2 class="text-2xl font-bold mb-4 ml-2">
        <Icon name="mdi:book-open-variant" class="mr-2"></Icon>
        Freigeschaltete Module
      </h2>
      <ol class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <li v-for="module in options.options.enabledModules" :key="module.route">
          <NuxtLink :to="`/schools/${school.schulnummer}/${module.route}`">
            <Card>
              <CardHeader>
                <Icon :name="module.icon" class="text-4xl"></Icon>
                <CardTitle>{{ module.name }}</CardTitle>
                <CardDescription>{{ module.description }}</CardDescription>
              </CardHeader>
            </Card>
          </NuxtLink>
        </li>
      </ol>
    </template>
    <template v-else>
      <div class="flex items-center flex-1 justify-center">
        <div>
          <h2 class="text-2xl font-bold mt-4 flex items-center">
            <Icon name="mdi:account-question" class="mr-2 size-8"></Icon>
            Nicht freigeschaltet!
          </h2>
          <p class="max-w-sm my-2">Die Schule ist noch nicht freigeschaltet. Sie benötigt noch einen Moderator. Um sie freizuschalten, befolge folgende Schritte:</p>
          <ol class="list-decimal list-inside ml-4 marker:text-primary marker:text-lg space-y-2">
            <li>
              Registriere deine Email-Adresse.
            </li>
            <li>
              Sende das untere Formular ab.
            </li>
            <li>
              Warte auf die Freischaltung.
            </li>
          </ol>
          <h2 class="text-2xl font-bold mt-8 flex items-center">
            <Icon name="mdi:account-plus" class="mr-2 size-6"></Icon>
            Moderator vorschlagen
          </h2>
          <p class="my-2 font-semibold">Derzeitiger account: <span class="font-normal">{{ user?.displayname ?? "Nicht angemeldet!" }}</span></p>
          <AutoForm :schema="schema" :field-config="{message: { component: 'textarea'}}" @submit="submitNewModerator">
            <Button type="submit" class="mt-4" :disabled="hasSubmitted || !user">
              {{ hasSubmitted ? 'Gesendet' : 'Absenden'}}
              <Icon name="mdi:send" class="mr-2"></Icon>
            </Button>
          </AutoForm>
          <p v-if="hasSubmitted && !hasWorked" class="text-red-500 mt-2 max-w-md">
            Entweder gab es die Schule nicht oder du wurdest bereits im System eingetragen.
          </p>
        </div>
      </div>
    </template>
  </main>
</template>

<script lang="js" setup>
import * as z from "zod";

const school = useCurrentSchool();
const hasSubmitted = ref(false);
const hasWorked = ref("");
const user = useUser();

definePageMeta({
  layout: 'headline',
});

useSeoMeta({
  title: () => `${school.value.schulname} - Module`,
})

const submitNewModerator = async (values) => {
  hasSubmitted.value = true;
  try {
    hasWorked.value = await $fetch("/api/v1/schools/moderator/suggestNewModerator", {
      method: "POST",
      body: JSON.stringify({
        ...values,
        email: user.value.mail,
        schoolId: school.value.schulnummer,
      }),
    });
  } catch (e) {
    hasWorked.value = false;
  }
};

const {data: options} = await useFetch("/api/v1/schools/options", {
  query: {schoolnumber: school.value.schulnummer},
});

const {data: isSchoolEnabled} = await useFetch("/api/v1/schools/schoolIsEnabled", {
  query: {schoolnumber: school.value.schulnummer},
});

const schema = z.object({
  message: z.string().min(35).describe("Deine Nachricht"),
});
</script>
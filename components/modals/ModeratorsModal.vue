<template>
  <Modal :model-value="isOpen" @close="close">
    <template #title>
      Verwalte Moderatoren
    </template>
    <template #default>
      <Card class="mt-4">
        <CardHeader>
          <CardTitle>Neue Anfragen</CardTitle>
          <CardDescription>
            Hier siehst du alle Anfragen von Moderatoren.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion collapsible type="multiple">
            <AccordionItem v-for="request in incomingRequests" :key="request.email" :value="request.message">
              <AccordionTrigger>
                {{ request.email }}
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  <Icon class="mr-2" name="mdi:school"></Icon>
                  {{ request.school.schulname }} - <span class="text-muted-foreground">{{
                    request.school.schulnummer
                  }}</span>
                </div>
                <div>
                  <Icon class="mr-2" name="mdi:message"></Icon>
                  {{ request.message }}
                </div>
                <div class="flex gap-2 justify-end mt-4">
                  <Button :loading="loading" @click="acceptRequest(request.email)">Annehmen</Button>
                  <Button :loading="loading" @click="declineRequest(request.email)">Ablehnen</Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      <Card class="mt-4">
        <CardHeader>
          <CardTitle>Alle Moderatoren</CardTitle>
          <CardDescription>
            Hier siehst du alle Moderatoren von der Schule - <span class="text-muted-foreground">{{
              school?.schulname
            }}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol class="grid grid-cols-1 gap-4">
            <li v-for="moderator in moderators" :key="moderator.email">
              <Card>
                <CardHeader>
                  <CardTitle>{{ moderator.email }}</CardTitle>
                  <CardDescription>{{ moderator.school.schulname }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div class="flex gap-2 justify-end">
                    <Button :loading="loading" @click="removeModerator(moderator.email)">Entfernen</Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          </ol>
        </CardContent>
      </Card>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
const isOpen = ref(false);
const school = useCurrentSchool();
const loading = ref(false);

const {data: incomingRequests, refresh: refreshRequests} = useLazyFetch("/api/v1/schools/moderator/getRequests");
const {data: moderators, refresh: refreshAll} = useLazyFetch("/api/v1/schools/moderator/getAll", {
  query: {schoolId: school.value?.schulnummer},
});

const close = () => {
  isOpen.value = false;
};

const acceptRequest = async (mail: string) => {
  loading.value = true;
  try {
    await $fetch("/api/v1/schools/moderator/acceptRequest", {
      method: "POST",
      body: JSON.stringify({mail, schoolId: school.value?.schulnummer}),
    });

    await Promise.allSettled([refreshRequests(), refreshAll()]);
  } catch (e) {
  }
  loading.value = false;

};

const declineRequest = async (mail: string) => {
  loading.value = true;
  try {
    await $fetch("/api/v1/schools/moderator/declineRequest", {
      method: "POST",
      body: JSON.stringify({mail, schoolId: school.value?.schulnummer}),
    });

    await Promise.allSettled([refreshRequests(), refreshAll()]);
  } catch (e) {
  }
  loading.value = false;

};

const removeModerator = async (mail: string) => {
  loading.value = true;
  try {
    await $fetch("/api/v1/schools/moderator/removeModerator", {
      method: "POST",
      body: JSON.stringify({mail, schoolId: school.value?.schulnummer}),
    });

    await Promise.allSettled([refreshRequests(), refreshAll()]);
  } catch (e) {
  }
  loading.value = false;

};

const open = () => {
  isOpen.value = true;
};

defineExpose({
  open,
});
</script>
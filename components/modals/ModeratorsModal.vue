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
            <AccordionItem v-for="request in incomingRequests" :key="request.userId" :value="request.userId">
              <AccordionTrigger>
                {{ request.displayname }}
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
                <div>
                  <Icon class="mr-2" name="mdi:keyboard"></Icon>
                  {{ request.displayname }}
                </div>
                <div class="flex gap-2 justify-end mt-4">
                  <Button :loading="loading" @click="acceptRequest(request.userId)">Annehmen</Button>
                  <Button :loading="loading" @click="declineRequest(request.userId)">Ablehnen</Button>
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
          <ol class="flex flex-col space-y-4">
            <li v-for="(moderator, index) in moderators" :key="moderator.userId"
              class="relative border-l border-primary pl-4">
              <div class="absolute top-5 left-0 w-1 h-px bg-primary"></div>
              <div class="flex">
                <div class="flex gap-2 items-center">
                  <Avatar>
                    <AvatarFallback>
                      <Icon name="mdi:account" class="size-7 text-primary"></Icon>
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{{ moderator.displayname }}</div>
                    <div class="leading-tight text-muted-foreground">{{ moderator.email }}</div>
                  </div>
                </div>
                <Button class="ml-auto" :loading="loading" @click="removeModerator(moderator.userId)">Entfernen</Button>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
      <Card class="mt-4">
        <CardHeader>
          <CardTitle>Alle Module</CardTitle>
          <CardDescription>
            Hier siehst du alle Module von der Schule - <span class="text-muted-foreground">{{
              school?.schulname
            }}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol class="grid grid-cols-1 gap-4">
            <li v-for="module in moduleComputed" :key="module.id">
              <Card>
                <CardHeader>
                  <CardTitle>{{ module.name }}</CardTitle>
                  <CardDescription>{{ module.description }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Transition name="fade">
                    <Button :loading="loading" @click="disableModule(module.id)"
                      v-if="module.enabled">Deaktivieren</Button>
                    <Button :loading="loading" @click="enableModule(module.id)" v-else>Aktivieren</Button>
                  </Transition>
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
const school = useCurrentSchool();
const loading = ref(false);

const isOpen = defineModel('isOpen', {
  default: false,
});

const { data: enabledModules, refresh: refreshModules } = useLazyFetch("/api/v1/schools/modules/get", {
  query: { schoolId: school.value?.schulnummer },
});
const { data: availableModules } = useLazyFetch("/api/v1/schools/modules/getAvailableModules");
const { data: incomingRequests, refresh: refreshRequests } = useLazyFetch("/api/v1/schools/moderator/getRequests", {
  query: { schoolId: school.value?.schulnummer },
});
const { data: moderators, refresh: refreshAll } = useLazyFetch("/api/v1/schools/moderator/getAll", {
  query: { schoolId: school.value?.schulnummer },
});

const moduleComputed = computed(() => {
  if (!enabledModules.value || !availableModules.value) return [];

  return availableModules.value.map((module) => {
    return {
      ...module,
      enabled: enabledModules.value?.some((enabledModule) => enabledModule.id === module.id),
    }
  });
});

const close = () => {
  isOpen.value = false;
};

const enableModule = async (moduleId: number) => {
  loading.value = true;

  try {
    await $fetch("/api/v1/schools/modules/enableModule", {
      method: "POST",
      body: JSON.stringify({ moduleId, schoolId: school.value?.schulnummer }),
    });

    await refreshModules();
  } catch (e) {
  }
  loading.value = false;
};

const disableModule = async (moduleId: number) => {
  loading.value = true;
  try {
    await $fetch("/api/v1/schools/modules/disableModule", {
      method: "POST",
      body: JSON.stringify({ moduleId, schoolId: school.value?.schulnummer }),
    });

    await refreshModules();
  } catch (e) {
  }
  loading.value = false;
};

const acceptRequest = async (userId: string) => {
  loading.value = true;
  try {
    await $fetch("/api/v1/schools/moderator/acceptRequest", {
      method: "POST",
      body: JSON.stringify({ userId, schoolId: school.value?.schulnummer }),
    });

    await Promise.allSettled([refreshRequests(), refreshAll()]);
  } catch (e) {
  }
  loading.value = false;

};

const declineRequest = async (userId: string) => {
  loading.value = true;
  try {
    await $fetch("/api/v1/schools/moderator/declineRequest", {
      method: "POST",
      body: JSON.stringify({ userId, schoolId: school.value?.schulnummer }),
    });

    await Promise.allSettled([refreshRequests(), refreshAll()]);
  } catch (e) {
  }
  loading.value = false;

};

const removeModerator = async (userId: string) => {
  loading.value = true;
  try {
    await $fetch("/api/v1/schools/moderator/removeModerator", {
      method: "POST",
      body: JSON.stringify({ userId, schoolId: school.value?.schulnummer }),
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

<style scoped>
.fade-leave-active {
  transition: all 0.35s ease-out;
  position: absolute;
}

.fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Element entering - slides from left */
.fade-enter-active {
  transition: all 0.35s ease-out;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}
</style>
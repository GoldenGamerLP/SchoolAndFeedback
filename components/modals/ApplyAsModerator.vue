<template>
    <Modal :model-value="isOpen" @close="close">
        <template #title>
            Bewerbe dich als Moderator
        </template>
        <template #default>
            <div class="flex items-center flex-1 justify-center">
                <div>
                    <h2 class="text-2xl font-bold mt-4 flex items-center">
                        <Icon name="mdi:account-question" class="mr-2 size-8"></Icon>
                        Nicht freigeschaltet!
                    </h2>
                    <p class="max-w-sm my-2">Die Schule ist noch nicht freigeschaltet. Sie benötigt noch einen
                        Moderator. Um sie
                        freizuschalten, befolge folgende Schritte:</p>
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
                    <p class="my-2 font-semibold">Derzeitiger account: <span class="font-normal">{{ user?.displayname ??
                            "Nicht angemeldet!" }}</span></p>
                    <AutoForm :schema="schema" :field-config="{ message: { component: 'textarea' } }"
                        @submit="submitNewModerator">
                        <Button type="submit" class="mt-4" :disabled="hasSubmitted || !user">
                            {{ hasSubmitted ? 'Gesendet' : 'Absenden' }}
                            <Icon name="mdi:send" class="mr-2"></Icon>
                        </Button>
                    </AutoForm>
                    <p v-if="hasSubmitted && !hasWorked" class="text-red-500 mt-2 max-w-md">
                        Entweder gab es die Schule nicht oder du wurdest bereits im System eingetragen.
                    </p>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script lang="js" setup>
import * as z from "zod";

const school = useCurrentSchool();
const hasSubmitted = ref(false);
const hasWorked = ref("");
const user = useUser();
const isOpen = ref(false);

const submitNewModerator = async (values) => {
    hasSubmitted.value = true;
    try {
        hasWorked.value = await $fetch("/api/v1/schools/moderator/suggestNewModerator", {
            method: "POST",
            body: JSON.stringify({
                ...values,
                userId: user.value.id,
                schoolId: school.value.schulnummer,
            }),
        });
    } catch (e) {
        hasWorked.value = false;
    }
};

const schema = z.object({
    message: z.string().min(35).describe("Deine Nachricht"),
});

const close = () => {
    isOpen.value = false;
};

defineExpose({
    open: () => {
        isOpen.value = true;
    },
});
</script>
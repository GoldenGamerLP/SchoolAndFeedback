<template>
    <Modal :model-value="isOpen" @close="close">
        <template #title>
            Erstelle eine Frage
        </template>
        <template #default>
            <AutoForm :schema="schema" :fieldConfig="{description: { component: 'textarea'}}" @submit="submit">
                <Button type="submit">Erstellen</Button>
            </AutoForm>
        </template>
    </Modal>
</template>

<script setup lang="ts">
import * as z from 'zod';
import useQuestion from '~/composables/question';
import type { CreateQuestionDto } from '~/types/questions';

const questionComp = useQuestion();
const isOpen = ref(false);
const isLoading = ref(false);
const emits = defineEmits(['update']);

const schema = z.object({
    title: z.string().describe("Titel der Frage").min(5).max(100),
    description: z.string().optional().default('').describe("Beschreibung der Frage"),
    tags: z.array(z.string()).default([]).describe("Tags"),
});

const submit = async (data: CreateQuestionDto) => {
    if(isLoading.value) return;
    isOpen.value = false;
    isLoading.value = true;

    try {
        const res = await questionComp.createQuestion(data);
        if(res) {
            emits('update');
        }
    } catch (error) {
        console.error(error);
    }

    isLoading.value = false;
};

const close = () => {
    isOpen.value = false;
};

defineExpose({
    open: () => {
        isOpen.value = true;
    },
});
</script>
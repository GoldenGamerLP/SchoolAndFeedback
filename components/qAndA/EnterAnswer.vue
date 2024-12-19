<template>
  <div class="bg-muted text-muted-foreground border border-border rounded-lg p-4 mt-4">
    <h2 class="text-xl font-bold">Antwort hinzufügen zu "{{ conversation?.question.title }}"</h2>
    <AutoForm
        :fieldConfig="{ content: { component: 'textarea', hideLabel: true, inputProps: { placeholder: user ? 'Was denkst du?' : 'Logge dich ein um zu schreiben!', disabled: isSubmitting } } }"
        :form="form"
        :schema="schema"
        @submit="createAnswer">
      <Button :disabled="!user || isSubmitting" class="mt-2" type="submit">
        <Icon v-if="isSubmitting" class="mr-2 size-5 animate-spin" name="mdi:loading"></Icon>
        <Icon v-else class="mr-2 size-5" name="mdi:plus"></Icon>
        Antwort hinzufügen
      </Button>
    </AutoForm>
  </div>
</template>
<script lang="ts" setup>
import type {Conversation, QuestionAnswerEndriched} from "~/types/questions";
import useQuestion from "~/composables/question";
import * as z from "zod";
import {useForm} from "vee-validate";
import {toTypedSchema} from "@vee-validate/zod";

const props = defineProps<{
  conversation: Conversation;
}>();

const questionComp = useQuestion();
const user = useUser();
const isSubmitting = ref(false);

const schema = z.object({
  content: z.string().min(25, 'Deine Antwort sollte mindestens 25 Zeichen lang sein.').max(5000, 'Deine Antwort sollte nicht länger als 5000 Zeichen sein.').describe('Deine Antwort'),
});

const form = useForm({
  validationSchema: toTypedSchema(schema),
})

const createAnswer = async (data: { content: string }) => {
  isSubmitting.value = true;
  try {
    const res: QuestionAnswerEndriched = await questionComp.createAnswer(props.conversation.question.qIdentifier, data.content);
    if (res) {
      form.resetForm();
      //FIXME: A workarround, could be done better
      res.author = user.value?.displayname || 'Anonym';
      props.conversation.answers.push(res);
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>
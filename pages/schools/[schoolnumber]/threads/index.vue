<template>
    <main class="flex-1 text-card-foreground p-4 h-full rounded-t-xl border-t flex flex-col bg-card/50">
        <!-- Tabs container with explicit height -->
        <Tabs :default-value="'relevance'" class="flex flex-col h-full" @update:model-value="setTabValue">
            <TabsList>
                <TabsTrigger value="relevance">
                    <Icon name="mdi:comment-question-outline" class="mr-2 size-5"></Icon>
                    Alle Fragen
                </TabsTrigger>
                <TabsTrigger value="open">
                    <Icon name="mdi:account" class="mr-2 size-5"></Icon>
                    Offene Fragen
                </TabsTrigger>
                <TabsTrigger value="answered">
                    <Icon name="mdi:account-check" class="mr-2 size-5"></Icon>
                    Beantwortete Fragen
                </TabsTrigger>
                <TabsTrigger value="own" :disabled="!user">
                    <Icon name="mdi:account" class="mr-2 size-5"></Icon>
                    Meine Fragen
                </TabsTrigger>
            </TabsList>
            <Searchbar :sortOptions="sortOptions" :setSort="setSort" :isSortOptionActive="isSortOptionActive" v-model:search="searchQuery" @createQuestion="createQModal?.open()" />
            <div class="flex-1 min-h-0 h-0 mt-4">
                <ol class="grid grid-cols-1 gap-4">
                    <Entry v-for="question in questions" :key="question.qIdentifier" :question="question" />
                </ol>
                <div v-if="!questions?.length" class="flex flex-col items-center justify-center h-full">
                    <Icon name="mdi:comment-question-outline" class="text-6xl text-muted-foreground"></Icon>
                    <p class="text-muted-foreground">Keine Fragen gefunden</p>
                </div>
            </div>
        </Tabs>
        <CreateQuestionModal ref="createQModal" @update="refresh()" />
    </main>
</template>

<script lang="ts" setup>
import Entry from '~/components/qAndA/Entry.vue';
import Searchbar from '~/components/qAndA/searchbar.vue';
import CreateQuestionModal from '~/components/modals/CreateQuestionModal.vue';

const school = useCurrentSchool();
const user = useUser();

definePageMeta({
    description: 'Alle Fragen und Antworten',
    layout: 'headline',
    pageTransition: {
        name: 'slide-left',
        mode: 'out-in'
    }
});

useSeoMeta({
    title: () => `${school.value!.schulname} - Fragen und Antworten`,
});

const createQModal = ref<InstanceType<typeof CreateQuestionModal>>();

interface SortOption {
    label: string;
    value: string;
    icon: string;
}

const sortOptions = ref([
    { label: 'Newest', value: 'newest', icon: 'mdi:sort-ascending' },
    { label: 'Oldest', value: 'oldest', icon: 'mdi:sort-descending' },
    { label: 'Votes', value: 'votes', icon: 'mdi:star' },
]) as Ref<SortOption[]>;

const currentSort = ref(0);

const setSort = (option: SortOption) => {
    currentSort.value = sortOptions.value.findIndex((item) => item === option);
};

const isSortOptionActive = (option: Number) => {
    return currentSort.value === option;
};

const getCurrentSort = computed(() => sortOptions.value[currentSort.value]);

onMounted(() => {
    currentSort.value = 0;
});

const currentTab = ref('relevance');

const setTabValue = (value: any) => {
    currentTab.value = value;
};

const searchQuery = ref('');

const { data: questions, refresh } = await useFetch('/api/v1/questions/get', {
    query: computed(() => ({
        searchCriteria: currentTab.value,
        sort: getCurrentSort.value.value,
        search: searchQuery.value,
        schoolId: school.value!.schulnummer as number
    })),
    watch: [currentTab, currentSort, searchQuery]
});
</script>
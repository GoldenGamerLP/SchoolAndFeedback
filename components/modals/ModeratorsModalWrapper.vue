<template>
    <LazyModalsModeratorsModal
        v-model:isOpen="isOpen"
        @close="isOpen = false"
        v-if="isOpen"
    />
</template>

<script lang="ts" setup>
const isOpen = ref(false);

defineExpose({
    open: () => {
        isOpen.value = true;
    },
});
</script>
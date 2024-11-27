<template>
	<div class="items-center mt-2 flex flex-col md:flex-row md:justify-between">
		<div class="relative w-full md:w-auto flex items-center">
			<Input id="search" type="text" placeholder="Search..." class="pl-10 w-full md:w-96" v-model="searchbar" />
			<span class="absolute start-0 inset-y-0 flex items-center justify-center pl-3">
				<Icon name="mdi:magnify" class="text-secondary-foreground size-5"></Icon>
			</span>
		</div>
		<div class="flex items-center mt-2 md:mt-0">
			<Popover>
				<PopoverTrigger as-child>
					<Button variant="secondary" class="mr-2">
						<Icon name="mdi:sort" class="text-secondary-foreground size-5"></Icon>
						Sortieren nach
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<h3 class="text-lg font-bold text-center mb-4">Sortieren nach</h3>
					<ol class="space-y-1">
						<li v-for="option, index of sortOptions" :key="option.value"
							class="flex items-center justify-between p-2 rounded-lg hover:bg-secondary cursor-pointer border border-1"
							@click="setSort(option)">
							<span class="flex items-center gap-2">
								<Icon :name="option.icon" class="text-xl"></Icon>
								<span>{{ option.label }}</span>
							</span>
							<Icon name="mdi:check" class="text-primary size-6" v-if="isSortOptionActive(index)">
							</Icon>
						</li>
					</ol>
				</PopoverContent>
			</Popover>
			<Button variant="default" @click="events('createQuestion')" :disabled="!user">
				<Icon name="mdi:plus" class="text-secondary-foreground size-5"></Icon>
				Erstelle eine Frage
			</Button>
		</div>
	</div>
</template>

<script setup lang="ts">
const user = useUser();

interface SortOption {
	label: string;
	value: string;
	icon: string;
}

const events = defineEmits(["createQuestion"]);

const searchbar = defineModel("search", {
	type: String,
	default: "",
});

defineProps<{
	sortOptions: SortOption[];
	setSort: (option: SortOption) => void;
	isSortOptionActive: (option: Number) => boolean;
}>()
</script>

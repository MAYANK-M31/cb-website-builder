<template>
	<div>
		<div class="flex flex-row flex-wrap gap-4">
			<BuilderInput
				label="Page Title"
				type="text"
				class="w-full text-sm [&>label]:w-[60%] [&>label]:min-w-[180px]"
				:modelValue="pageStore.activePage?.page_title"
				:disabled="builderStore.readOnlyMode"
				@input="(val: string) => updateActivePage('page_title', val)"
				@update:modelValue="(val: string) => updateActivePage('page_title', val)" />
			<BuilderInput
				type="text"
				class="w-full text-sm [&>label]:w-[60%] [&>label]:min-w-[180px] [&>p]:text-p-xs"
				label="Route"
				description="The URL path for this page. For variables, use colon (e.g. /users/:id)"
				:modelValue="pageStore.activePage?.route"
				:disabled="builderStore.readOnlyMode"
				:hideClearButton="true"
				@input="(val: string) => updateActivePage('route', val)"
				@update:modelValue="(val: string) => updateActivePage('route', val)" />
			<!-- Dynamic Route Variables -->
			<CollapsibleSection
				sectionName="URL Variables"
				v-if="dynamicVariables.length"
				class="w-full [&>div>h3]:!text-xs [&>div>h3]:!text-ink-gray-5">
				<BuilderInput
					v-for="(variable, index) in dynamicVariables"
					:key="index"
					type="text"
					:label="variable.replace(/_/g, ' ')"
					:modelValue="pageStore.routeVariables[variable]"
					:disabled="builderStore.readOnlyMode"
					@update:modelValue="(val: string) => pageStore.setRouteVariable(variable, val)" />
			</CollapsibleSection>
		</div>
		<div class="mt-4 flex justify-end">
			<Button variant="solid" iconLeft="lucide-save" :disabled="builderStore.readOnlyMode" @click="save">
				Save
			</Button>
		</div>
	</div>
</template>
<script setup lang="ts">
import useBuilderStore from "@/stores/builderStore";
import usepageStore from "@/stores/pageStore";
import { BuilderPage } from "@/types/doctypes";
import { getRouteVariables } from "@/utils/helpers";
import { computed, ref } from "vue";
import { Button } from "frappe-ui";
import CollapsibleSection from "./CollapsibleSection.vue";

const props = defineProps<{
	close?: () => void;
}>();

const builderStore = useBuilderStore();
const pageStore = usepageStore();

const dynamicVariables = computed(() => {
	return getRouteVariables(pageStore.activePage?.route || "");
});

const updateActivePageTimer = ref<ReturnType<typeof setTimeout> | undefined>();

const updateActivePage = (key: keyof BuilderPage, val: string) => {
	if (pageStore.activePage) {
		pageStore.activePage[key] = val as never;
	}
	clearTimeout(updateActivePageTimer.value);
	updateActivePageTimer.value = setTimeout(() => {
		pageStore.updateActivePage(key, val);
	}, 300);
};

const save = () => {
	try {
		clearTimeout(updateActivePageTimer.value);
		const page = pageStore.activePage;
		if (page) {
			pageStore.savePage({
				page_title: page.page_title,
				route: page.route,
			});
		} else {
			pageStore.savePage();
		}
	} finally {
		props.close?.();
	}
};
</script>

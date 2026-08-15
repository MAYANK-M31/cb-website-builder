<template>
	<div>
		<router-view v-slot="{ Component }">
			<keep-alive>
				<component :is="Component" />
			</keep-alive>
		</router-view>
		<FrappeUIProvider />
	</div>
</template>
<script setup lang="ts">
import useBuilderStore from "@/stores/builderStore";
import usePageStore from "@/stores/pageStore";
import { useTitle } from "@vueuse/core";
import { useSiteReadOnlyNotice } from "@/utils/useSiteReadOnlyNotice";
import { FrappeUIProvider } from "frappe-ui";
import { computed, provide } from "vue";
import { useRoute } from "vue-router";
import { sessionUser } from "./router";

// The builder is always dark mode. Force data-theme and the vueuse storage key
// before render so every useDark() instance resolves to dark.
localStorage.setItem("vueuse-color-scheme", "dark");
document.documentElement.setAttribute("data-theme", "dark");

// do not remove this
const builderStore = useBuilderStore();
const pageStore = usePageStore();
const route = useRoute();

provide("sessionUser", sessionUser);

const title = computed(() => {
	return pageStore.activePage && route.name !== "home"
		? `${pageStore.activePage.page_title || "Untitled"} | Builder`
		: "CreatorBase Builder";
});

useTitle(title);

useSiteReadOnlyNotice();
</script>

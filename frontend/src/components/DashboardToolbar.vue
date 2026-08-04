<template>
	<div
		class="toolbar flex h-12 items-center justify-between border-b-[1px] border-outline-gray-1 bg-surface-base px-3">
		<Button variant="ghost" size="sm" class="gap-1.5" iconLeft="lucide-arrow-left" @click="goBackToDashboard">
			Back to Dashboard
		</Button>

	</div>
</template>

<script setup lang="ts">
import { Button } from "frappe-ui";


const goBackToDashboard = () => {
	if (window.parent !== window) {
		window.parent.postMessage({ type: "creatorbase:back-to-dashboard" }, "*");
	} else {
		window.location.href = (window as any).builder_path || "/builder";
	}
};
</script>

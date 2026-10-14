<template>
	<FileUploader
		:file-types="image_type"
		:uploadArgs="{
			private: false,
			folder: 'Home/Builder Uploads',
			upload_endpoint: '/api/method/builder.api.upload_builder_asset',
		}"
		class="text-base"
		@success="
			(file: FileDoc) => {
				$emit('upload', file.file_url);
			}
		">
		<template v-slot="{ file, progress, uploading, openFileSelector }">
			<div class="flex items-end gap-2">
				<Button @click="openFileSelector">
					{{ uploading ? `Uploading ${progress}%` : image_url ? "Change" : "Upload" }}
				</Button>
				<Button v-if="image_url" @click="$emit('remove')">Remove</Button>
			</div>
		</template>
	</FileUploader>
</template>
<script setup lang="ts">
import { FileUploader } from "frappe-ui";
const prop = withDefaults(
	defineProps<{
		image_url?: string;
		image_type?: string;
		label?: string;
	}>(),
	{
		image_type: "image/*",
		label: "",
	},
);
const emit = defineEmits(["upload", "remove"]);
</script>

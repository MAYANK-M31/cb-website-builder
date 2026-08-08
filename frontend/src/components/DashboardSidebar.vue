<template>
	<Sidebar class="border-r border-outline-gray-1">
		<div class="flex h-12 shrink-0 items-center px-1">
			<SidebarItem label="Back to Dashboard" class="w-full" @click="goBackToDashboard">
				<template #prefix><ArrowLeftIcon class="size-4" /></template>
			</SidebarItem>
		</div>

		<ScrollArea class="min-h-0 flex-1" viewport-class="px-2 pt-0.5 pb-2">
			<nav class="space-y-0.5">
				<SidebarItem
					label="Home Pages"
					:active="!builderStore.activeFolder && builderStore.activeSection === 'home'"
					@click="setSection('home')">
					<template #prefix><HomeIcon class="size-4" /></template>
				</SidebarItem>
				<SidebarItem
					label="Funnel Pages"
					:active="!builderStore.activeFolder && builderStore.activeSection === 'funnel'"
					@click="setSection('funnel')">
					<template #prefix><FilterIcon class="size-4" /></template>
				</SidebarItem>
				<SidebarItem
					label="All Pages"
					:active="!builderStore.activeFolder && builderStore.activeSection === 'all'"
					@click="setSection('all')">
					<template #prefix><FilesIcon class="size-4" /></template>
				</SidebarItem>
				<SidebarItem label="Settings" @click="showSettingsDialog = true">
					<template #prefix><SettingsIcon class="size-4" /></template>
				</SidebarItem>
			</nav>

			<div class="mt-5 flex h-7 items-center justify-between">
				<SidebarLabel>Folders</SidebarLabel>
				<Button
					variant="ghost"
					size="sm"
					icon="lucide-plus text-ink-gray-5"
					label="New folder"
					@click="promptCreateFolder()" />
			</div>

			<p v-if="!builderProjectFolder.data?.length" class="pl-2 text-sm text-ink-gray-5">No folders yet</p>
			<nav class="mt-0.5 space-y-0.5">
				<SidebarItem
					v-for="project in builderProjectFolder.data"
					:key="project.folder_name"
					icon="lucide-folder"
					:label="project.folder_name"
					:active="isFolderActive(project.folder_name)"
					@click="setFolderActive(project.folder_name)">
					<EditableSpan
						v-model="project.folder_name"
						:editable="renamingFolder === project.folder_name"
						:onChange="
							async (newName) => {
								await renameFolder(newName, project);
								renamingFolder = '';
							}
						"
						@blur="renamingFolder = ''"
						class="w-full truncate text-sm capitalize">
						{{ project.folder_name }}
					</EditableSpan>
					<template #suffix>
						<Button
							v-if="isFolderActive(project.folder_name) && project.is_standard"
							variant="ghost"
							size="sm"
							icon="lucide-info"
							disabled
							tooltip="System generated folder cannot be edited or deleted"
							class="cursor-pointer" />
						<Dropdown
							v-else-if="isFolderActive(project.folder_name)"
							placement="right"
							:options="[
								{
									label: 'Rename',
									onClick: () => {
										renamingFolder = project.folder_name;
									},
									icon: 'lucide-edit',
								},
								{
									label: 'Delete Folder',
									onClick: () => deleteFolder(project.folder_name),
									icon: 'lucide-trash',
								},
							]">
							<template v-slot="{ open }">
								<Button icon="lucide-more-horizontal" size="sm" variant="ghost" @click="open" />
							</template>
						</Dropdown>
					</template>
				</SidebarItem>
			</nav>
		</ScrollArea>

		<div class="mt-auto">
			<p class="p-2 text-center text-sm text-ink-gray-4">Version: {{ builderVersion }}</p>
			<TrialBanner v-if="builderStore.isFCSite" />
		</div>
	</Sidebar>
	<Dialog v-model="showSettingsDialog" :dismissable="false" size="5xl" bare>
		<template #default>
			<DialogTitle class="sr-only">Global Builder Settings</DialogTitle>
			<DialogDescription class="sr-only">
				Configure global settings for this builder project.
			</DialogDescription>
			<BuilderSettings @close="showSettingsDialog = false" :onlyGlobal="true" bare />
		</template>
	</Dialog>
</template>
<script lang="ts" setup>
import EditableSpan from "@/components/EditableSpan.vue";
import FilesIcon from "@/components/Icons/Files.vue";
import SettingsIcon from "@/components/Icons/SettingsGear.vue";
import FilterIcon from "~icons/lucide/filter";
import HomeIcon from "~icons/lucide/house";
import ArrowLeftIcon from "~icons/lucide/arrow-left";
import builderProjectFolder from "@/data/builderProjectFolder";
import useBuilderStore from "@/stores/builderStore";
import { BuilderProjectFolder } from "@/types/doctypes";
import { promptCreateFolder } from "@/utils/dialogs";
import { confirm } from "@/utils/helpers";
import {
	Button,
	createResource,
	Dialog,
	Dropdown,
	ScrollArea,
	Sidebar,
	SidebarItem,
	SidebarLabel,
} from "frappe-ui";
import { TrialBanner } from "frappe-ui/frappe";
import { DialogDescription, DialogTitle } from "reka-ui";
import { defineAsyncComponent, ref } from "vue";

const BuilderSettings = defineAsyncComponent(() => import("@/components/BuilderSettings.vue"));
const builderStore = useBuilderStore();
const renamingFolder = ref("");

const goBackToDashboard = () => {
	if (window.parent !== window) {
		window.parent.postMessage({ type: "creatorbase:back-to-dashboard" }, "*");
	} else {
		window.location.href = (window as any).builder_path || "/builder";
	}
};

const isFolderActive = (folderName: string) => {
	return builderStore.activeFolder === folderName;
};
const setSection = (section: string) => {
	builderStore.activeFolder = "";
	builderStore.activeSection = section;
};
const setFolderActive = (folderName: string) => {
	builderStore.activeFolder = folderName;
};

const renameFolder = async (newFolderName: string, targetFolder: BuilderProjectFolder) => {
	if (!newFolderName) return;
	return createResource({
		url: "frappe.client.rename_doc",
	})
		.submit({
			doctype: "Builder Project Folder",
			old_name: targetFolder.folder_name,
			new_name: newFolderName,
		})
		.then(() => {
			builderProjectFolder.data = (builderProjectFolder.data ?? []).map((folder: BuilderProjectFolder) => {
				if (folder.folder_name === builderStore.activeFolder) {
					folder.folder_name = newFolderName;
				}
				return folder;
			});
			setFolderActive(newFolderName);
		});
};

const deleteFolder = async (folderName: string) => {
	const confirmed = await confirm(
		"Are you sure you want to delete this folder? All the pages under this folder will be visible under \"All Pages\"",
	);
	if (!confirmed) return;
	await createResource({
		url: "builder.api.delete_folder",
		method: "POST",
		params: {
			folder_name: folderName,
		},
		auto: true,
	});
	builderProjectFolder.data = (builderProjectFolder.data ?? []).filter(
		(folder: BuilderProjectFolder) => folder.folder_name !== folderName,
	);
	setFolderActive("");
};
const showSettingsDialog = ref(false);
const builderVersion = (window as any).builder_version;
</script>

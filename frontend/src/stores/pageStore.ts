import type Block from "@/block";
import { builderSettings } from "@/data/builderSettings";
import { webPages } from "@/data/webPage";
import router from "@/router";
import useBuilderStore from "@/stores/builderStore";
import useCanvasStore from "@/stores/canvasStore";
import useComponentStore from "@/stores/componentStore.js";
import { BuilderClientScript, BuilderPage } from "@/types/doctypes";
import getBlockTemplate from "@/utils/blockTemplate";
import {
	confirm,
	generateId,
	getBlockInstance,
	getCopyWithoutParent,
	getRouteVariables,
} from "@/utils/helpers";
import { createDocumentResource, createListResource, createResource, toast } from "frappe-ui";
import { defineStore } from "pinia";
import { nextTick } from "vue";
import { getCreatorAuth, getWebappPageUrl } from "@/creatorbase";

// Serialize all set_value/save calls for the active page so concurrent writes to
// the same document can't trip Frappe's TimestampMismatchError (read-modify-write
// races) and so a debounced field edit always lands before publish.
let pendingSave: Promise<unknown> = Promise.resolve();
const serializeSave = (task: () => Promise<unknown>) => {
	const next = pendingSave.then(task, task);
	pendingSave = next.catch(() => undefined);
	return next;
};

const usePageStore = defineStore("pageStore", {
	state: () => ({
		routeVariables: <{ [key: string]: string }>{},
		pageData: <{ [key: string]: [] }>{},
		pageName: "Home",
		route: "/",
		selectedPage: <string | null>null,
		pageBlocks: <Block[]>[],
		saveId: null as string | null,
		activePage: <BuilderPage | null>null,
		activePageScripts: <BuilderClientScript[]>[],
		savingPage: false,
		settingPage: false,
		snapshotsVersion: 0,
	}),
	actions: {
		async setPage(pageName: string, resetCanvas = true, routeParams = null as Object | null) {
			this.settingPage = true;
			if (!pageName) {
				return;
			}

			const page = await this.fetchActivePage(pageName);
			if (!page) {
				toast.error("Page not found", {
					duration: Infinity,
				});
				return;
			}
			this.activePage = page;

			const blocks = JSON.parse(page.draft_blocks || page.blocks || "[]");
			this.editPage(!resetCanvas);
			if (!Array.isArray(blocks)) {
				const canvasStore = useCanvasStore();
				canvasStore.pushBlocks([blocks]);
			}
			this.pageBlocks = [getBlockInstance(blocks[0] || getBlockTemplate("body"))];
			this.pageName = page.page_name as string;
			this.route = page.route || "/" + this.pageName.toLowerCase().replace(/ /g, "-");
			this.selectedPage = page.name;
			const variables = localStorage.getItem(`${page.name}:routeVariables`) || "{}";
			this.routeVariables = JSON.parse(variables);
			if (routeParams) {
				Object.assign(this.routeVariables, routeParams);
			}
			await this.setPageData(this.activePage);

			const canvasStore = useCanvasStore();
			// switching pages always exits any active version preview
			canvasStore.clearVersionPreview();
			canvasStore.activeCanvas?.setRootBlock(this.pageBlocks[0], resetCanvas);

			if (page.client_scripts?.length) {
				// Fetch full script documents for each script
				const scriptsResource = createListResource({
					doctype: "Builder Client Script",
					fields: ["script_type", "name", "script"],
					filters: [["name", "in", page.client_scripts.map((script) => script.builder_script)]],
					auto: true,
				});

				await scriptsResource.list.promise;
				this.activePageScripts = scriptsResource.data as BuilderClientScript[];
			} else {
				this.activePageScripts = [];
			}

			nextTick(() => {
				const componentStore = useComponentStore();
				const interval = setInterval(() => {
					if (!componentStore.fetchingComponent.size) {
						this.settingPage = false;
						window.name = `editor-${pageName}`;
						clearInterval(interval);
						// detect pinned component instances whose live component drifted
						componentStore.refreshComponentUpdates();
						// surface any warnings stashed by a just-completed snapshot restore
						const restoreWarnings = sessionStorage.getItem("builder:restoreWarnings");
						if (restoreWarnings) {
							sessionStorage.removeItem("builder:restoreWarnings");
							for (const message of JSON.parse(restoreWarnings) as string[]) {
								toast.warning(message);
							}
						}
					}
				}, 50);
			});
		},

		async setActivePage(pageName: string) {
			this.selectedPage = pageName;
			const page = await this.fetchActivePage(pageName);
			if (!page) {
				return;
			}
			this.activePage = page;
		},

		async fetchActivePage(pageName?: string) {
			const webPageResource = await createDocumentResource({
				doctype: "Builder Page",
				name: pageName as string,
				auto: true,
			});
			try {
				await webPageResource.get.promise;
			} catch (e) {
				return null;
			}

			const page = webPageResource.doc as BuilderPage;
			return page;
		},

		editPage(retainSelection = false) {
			const canvasStore = useCanvasStore();
			if (!retainSelection) {
				canvasStore.activeCanvas?.clearSelection();
			}
			canvasStore.editingMode = "page";
		},

		async duplicatePage(page: BuilderPage) {
			toast.promise(
				createResource({
					url: "builder.api.duplicate_page",
					method: "POST",
					params: {
						page_name: page.name,
					},
				}).fetch(),
				{
					loading: "Duplicating page",
					success: async (page: BuilderPage) => {
						// load page and refresh
						router.push({ name: "builder", params: { pageId: page.page_name } }).then(() => {
							router.go(0);
						});
						return "Page duplicated";
					},
				},
			);
		},
		deletePage: async (page: BuilderPage) => {
			const confirmed = await confirm(
				`Are you sure you want to delete page: ${page.page_title || page.page_name}?`,
			);
			if (confirmed) {
				await toast.promise(webPages.delete.submit(page.name), {
					loading: "Deleting page",
					success: () => {
						return "Page deleted";
					},
					error: () => {
						return "Page deletion failed";
					},
				});
			}
		},

		async publishPage(openInBrowser = false) {
			// Flush any pending field edits (route, page_title, ...) so the doc that
			// gets published carries the values shown in the toolbar, and do it in the
			// same serialized save chain to avoid timestamp mismatches.
			const page = this.activePage;
			if (page) {
				await this.savePage({ route: page.route, page_title: page.page_title });
			} else {
				await this.savePage();
			}
			await this.waitTillPageIsSaved();
			return webPages.runDocMethod
				.submit({
					name: this.selectedPage as string,
					method: "publish",
					route_variables: this.routeVariables,
				})
				.then(async () => {
					this.activePage = await this.fetchActivePage(this.selectedPage as string);
					this.snapshotsVersion++;
					this.showPublishedWebappLink();
					if (openInBrowser) {
						this.openPageInBrowser(this.activePage as BuilderPage);
					}
				});
		},

		// After publish, surface the live CreatorBase webapp link (requires the
		// dashboard to have handed over auth via postMessage).
		showPublishedWebappLink() {
			const { subdomain } = getCreatorAuth();
			if (!subdomain) return;
			const url = getWebappPageUrl(this.activePage?.route ?? this.route, subdomain);
			if (!url) return;
			toast.success("Published successfully", {
				description: url,
				duration: 8000,
				action: {
					label: "Open live page",
					onClick: () => window.open(url, "_blank"),
				},
			});
		},

		async revertChanges() {
			const confirmed = await confirm(
				"This will revert all changes made to the page since the last publish. Are you sure you want to continue?",
			);
			if (confirmed) {
				await this.updateActivePage("draft_blocks", null);
				this.setPage(this.activePage?.name as string);
			}
		},

		async createManualSnapshot(label?: string) {
			const res = await webPages.runDocMethod.submit({
				name: this.selectedPage as string,
				method: "create_manual_snapshot",
				label: label || null,
			});
			this.snapshotsVersion++;
			return res;
		},

		async restoreSnapshot(snapshotName: string) {
			// wait out any in-flight autosave so it can't clobber the restored draft
			await this.waitTillPageIsSaved();
			const res = await webPages.runDocMethod.submit({
				name: this.selectedPage as string,
				method: "restore_snapshot",
				snapshot: snapshotName,
			});
			// surface any deleted-dependency warnings after the upcoming reload
			const warnings = (res?.message?.warnings || []) as string[];
			if (warnings.length) {
				sessionStorage.setItem("builder:restoreWarnings", JSON.stringify(warnings));
			}
			// router.go(0);
			// Instead of a hard reload, we could are just re-fetching the page document
			this.setPage(this.selectedPage as string, false);
			toast.success("Version restored");
		},

		async unpublishPage(page?: BuilderPage) {
			const targetName = page?.name || this.selectedPage;
			const targetTitle = page?.page_title || page?.page_name || "this page";
			const confirmed = await confirm(
				`Are you sure you want to unpublish "${targetTitle}"? It will no longer be accessible on the website.`,
			);
			if (!confirmed) {
				return;
			}
			return webPages.setValue
				.submit({
					name: targetName,
					published: false,
				})
				.then(() => {
					toast.success("Page unpublished");
					if (page) {
						page.published = 0;
					} else {
						this.setPage(this.selectedPage as string);
					}
					builderSettings.reload();
				});
		},

		updateActivePage(key: keyof BuilderPage, value: any) {
			if (!this.activePage) {
				return Promise.resolve(null);
			}
			// Optimistically update in-place so reactive bindings stay consistent
			this.activePage[key] = value;
			return serializeSave(() =>
				webPages.setValue.submit({
					name: this.activePage?.name as string,
					[key]: value,
				}),
			);
		},

		savePage(extraFields: Partial<BuilderPage> = {}) {
			const builderStore = useBuilderStore();
			if (builderStore.readOnlyMode) {
				// callers may have optimistically set this before invoking savePage
				this.savingPage = false;
				return;
			}

			// Own the saving flag here (not only in the editor watch) so every caller —
			// including direct savePage() calls — keeps waitTillPageIsSaved reliable.
			this.savingPage = true;

			const canvasStore = useCanvasStore();
			const pageData = JSON.stringify(
				canvasStore
					.getPageBlocks()
					.filter((block): block is Block => block !== undefined)
					.map((block: Block) => getCopyWithoutParent(block)),
			);
			const saveId = generateId();

			// more save requests can be triggered till the first one is completed
			this.saveId = saveId;
			const args = {
				name: this.selectedPage,
				draft_blocks: pageData,
				...extraFields,
			};
			return serializeSave(() =>
				webPages.setValue
					.submit(args)
					.then((page: BuilderPage) => {
						if (this.activePage) {
							Object.assign(this.activePage, page);
						} else {
							this.activePage = page;
						}
					})
					.catch((e: { exc_type?: string }) => {
						if (e?.exc_type === "InReadOnlyMode") {
							builderStore.isSiteInReadOnlyMode = true;
							return;
						}
						throw e;
					})
					.finally(() => {
						if (this.saveId === saveId) {
							this.saveId = null;
							this.savingPage = false;
						}
						canvasStore.activeCanvas?.toggleDirty(false);
					}),
			);
		},

		setPageData(page?: BuilderPage) {
			if (!page || !page.page_data_script) {
				this.pageData = {};
				return;
			}
			return webPages.runDocMethod
				.submit({
					method: "get_page_data",
					name: page.name,
					route_variables: this.routeVariables,
				})
				.then((data: { message: { [key: string]: [] } }) => {
					this.pageData = data.message;
				})
				.catch((e: { exc: string | null }) => {
					const error_message = e.exc?.split("\n").slice(-2)[0];
					toast.error("There was an error while fetching page data", {
						description: error_message,
					});
				});
		},

		setRouteVariable(variable: string, value: string) {
			this.routeVariables[variable] = value;
			localStorage.setItem(`${this.selectedPage}:routeVariables`, JSON.stringify(this.routeVariables));
			this.setPageData(this.activePage as BuilderPage);
		},

		openPageInBrowser(page: BuilderPage) {
			// Empty/"/" route = homepage. Don't treat it as falsy and fall back to a
			// derived path — reuse the stored route as-is and let the resolvers map
			// "" (or "/") to the site root.
			const route = page?.route ?? this.activePage?.route ?? this.route ?? "/";
			// Prefer the CreatorBase webapp (SSR of the S3-published HTML) so the
			// preview opens at the real public URL instead of the builder host.
			const { subdomain } = getCreatorAuth();
			const webappUrl = subdomain ? getWebappPageUrl(route, subdomain) : "";
			const pageURL = webappUrl || this.getResolvedPageURL(true, page);
			// Never hand an invalid URL to window.open (a scheme-only "http:" from a
			// broken/webapp base crashes the click) — fall back to the resolved page.
			const hasValidUrl = (() => {
				try {
					const parsed = new URL(pageURL, window.location.origin);
					return Boolean(parsed.protocol && (/^https?:$/.test(parsed.protocol) || parsed.hostname));
				} catch {
					return false;
				}
			})();
			const safeUrl = hasValidUrl ? pageURL : this.getResolvedPageURL(true, page) || "/";
			// Open in a fresh tab every click (window name "builder-preview" would
			// reuse the same tab).
			window.open(safeUrl, "_blank", "noopener,noreferrer");
		},

		getResolvedPageURL(prependSlash = true, page: BuilderPage | null = null) {
			let route = page?.route ?? this.activePage?.route ?? "";
			if (this.pageData) {
				const routeVariables = getRouteVariables(route || "");
				routeVariables.forEach((variable: string) => {
					const routeVariableValue = this.routeVariables[variable];
					if (routeVariableValue) {
						if (route?.includes(`<${variable}>`)) {
							route = route?.replace(`<${variable}>`, routeVariableValue);
						} else if (route?.includes(`:${variable}`)) {
							route = route?.replace(`:${variable}`, routeVariableValue);
						}
					}
				});
			}
			const normalizedRoute = (route || "").trim().replace(/^\/+/, "");
			// Empty (or "/") route resolves to the site root.
			return normalizedRoute ? `${prependSlash ? "/" : ""}${normalizedRoute}` : "/";
		},

		async waitTillPageIsSaved() {
			// small delay so that all the save requests are triggered
			if (!this.savingPage) {
				await new Promise((resolve) => setTimeout(resolve, 300));
			}
			return new Promise((resolve) => {
				const interval = setInterval(() => {
					if (!this.savingPage) {
						clearInterval(interval);
						resolve(null);
					}
				}, 100);
			});
		},
		isHomePage(page: BuilderPage | null = null) {
			return builderSettings.doc?.home_page === (page || this.activePage)?.route;
		},
	},
});

export default usePageStore;

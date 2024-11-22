import templates from "./theme/templates";
import { readMarkdownFiles } from "./theme/mdUtils";
import * as fs from "node:fs";
import * as path from "node:path";
import defaults from "./theme/defaults";

async function Process(options: any, isDevelopment = true) {
	const docsDir = options.docsDir ?? defaults.docsDir;
	const sourcesTag = options.sourcesTag ?? defaults.sourcesTag;
	const referencesTag = options.referencesTag ?? defaults.referencesTag;
	const nodes = readMarkdownFiles(docsDir, sourcesTag, referencesTag);

	let filePath = path.join(defaults.staticDir, defaults.filename);
	if (!isDevelopment) {
		filePath = path.join(
			options.buildDir ?? defaults.buildDir,
			defaults.filename,
		);
	}
	const nodeString = JSON.stringify(nodes, null, 2);
	await fs.promises.writeFile(path.join(filePath), nodeString, "utf8");
}

export default async function docusaurusGraph(context: any, options: any) {
	const { siteConfig } = context;
	return {
		name: "docusaurus-graph",

		async loadContent() {
			const themeConfig = siteConfig.themeConfig;
			themeConfig.navbar.items.push({
				type: "html",
				position: "right",
				value: templates.graphButton,
			});

			Process(options);
		},

		async contentLoaded() {},

		async postBuild() {
			Process(options, false);
		},

		injectHtmlTags() {
			return {
				headTags: [...templates.headGraph],
				preBodyTags: [
					{
						tagName: "style",
						innerHTML: templates.styleGraph,
					},
				],
				postBodyTags: [
					{
						tagName: "div",
						innerHTML: templates.containerGraph,
					},
					{
						tagName: "script",
						innerHTML: templates.scriptGraph,
					},
				],
			};
		},
	};
}

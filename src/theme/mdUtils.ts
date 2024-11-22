import * as fs from "node:fs";
import * as path from "node:path";
import * as marked from "marked";
import matter from "gray-matter";

interface Node {
	id: string;
	title: string;
	linkTo: string[];
	referencedBy: string[];
}

function validName(name: string): boolean {
	return name[0] !== "_";
}

function extractTitleFromMarkdown(content: string): string | null {
	const tokens = marked.lexer(content);
	const firstHeader = tokens.find(
		(token: marked.Token) => token.type === "heading" && token.depth === 1,
	);

	return firstHeader ? firstHeader.raw.substring(2).trim() : null;
}

function extractTitleFromPath(filename: string): string {
	return path.basename(filename).split(".")[0];
}

function isMdOrMdxFile(file: string): boolean {
	return (
		path.extname(file).toLowerCase() === ".md" ||
		path.extname(file).toLowerCase() === ".mdx"
	);
}

export function readMarkdownFiles(
	directoryPath: string,
	sourceTag = "sources",
	referenceTag = "references",
): Node[] {
	const nodes: Node[] = [];

	function getNode(id: string): Node | undefined {
		return nodes.find((item) => item.id === id);
	}

	function readDirectory(currentPath: string): void {
		const items = fs.readdirSync(currentPath);

		for (const item of items) {
			if (!validName(item)) return;

			const itemPath = path.join(currentPath, item);
			const stat = fs.statSync(itemPath);

			if (stat.isDirectory()) {
				readDirectory(itemPath);
			} else if (isMdOrMdxFile(itemPath)) {
				const fileContent = fs.readFileSync(itemPath, "utf-8");
				const { data } = matter(fileContent);
				const id = extractTitleFromPath(itemPath);
				const title = (extractTitleFromMarkdown(fileContent) as string) ?? id;

				if (typeof data[referenceTag] === "string")
					data[referenceTag] = [data[referenceTag]];

				if (typeof data[sourceTag] === "string")
					data[sourceTag] = [data[sourceTag]];

				const node = getNode(id);
				if (node) {
					node.title = title;
				} else {
					nodes.push({
						id,
						title,
						linkTo: [...(data[referenceTag] || [])],
						referencedBy: [...(data[sourceTag] || [])],
					});
				}

				if (data[referenceTag]) {
					for (const reference of data[referenceTag]) {
						const node = getNode(reference);
						if (node) {
							node.referencedBy.push(id);
						} else {
							nodes.push({
								id: reference,
								title: reference,
								linkTo: [],
								referencedBy: [id],
							});
						}
					}
				}

				if (data[sourceTag]) {
					for (const source of data[sourceTag]) {
						const node = getNode(source);
						if (node) {
							node.linkTo.push(id);
						} else {
							nodes.push({
								id: source,
								title: source,
								linkTo: [id],
								referencedBy: [],
							});
						}
					}
				}
			}
		}
	}

	readDirectory(directoryPath);

	return nodes;
}

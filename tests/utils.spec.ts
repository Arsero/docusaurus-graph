import { readMarkdownFiles } from "../src/theme/mdUtils";

const nodes = readMarkdownFiles("tests/content");

console.log(nodes);

test("create all nodes from folder", () => {
	expect(nodes.length).toBe(7);
});

test("link nodes from categories tag", () => {
	expect(
		nodes[0].id === "congratulations" && nodes[0].referencedBy[0] === "docs",
	).toBe(true);
	expect(
		nodes[1].id === "docs" && nodes[1].linkTo[0] === "congratulations",
	).toBe(true);
});

test("link nodes from references tag", () => {
	expect(
		nodes[2].id === "deploy-your-site" && nodes[2].linkTo[0] === "intro",
	).toBe(true);
	expect(
		nodes[3].id === "intro" && nodes[3].referencedBy[0] === "deploy-your-site",
	).toBe(true);
});

test("title without header", () => {
	expect(
		nodes[6].id === "doc-without-title" && nodes[6].linkTo[0] === "intro",
	).toBe(true);
});

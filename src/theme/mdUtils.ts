import * as fs from 'node:fs';
import * as path from 'node:path';
import * as marked from 'marked';
import matter from 'gray-matter';

interface Node {
  id: string;
  title: string;
  linkTo: string[];
  referencedBy: string[];
}

export function validName(name: string): boolean {
  return name[0] !== '_';
}

export function extractTitleFromMarkdown(content: string): string | null {
  const tokens = marked.lexer(content);
  const firstHeader = tokens.find(
    (token: marked.Token) => token.type === 'heading' && token.depth === 1
  );

  return firstHeader ? firstHeader.raw.substring(2).trim() : null;
}

export function isMdOrMdxFile(file: string): boolean {
  return (
    path.extname(file).toLowerCase() === '.md' ||
    path.extname(file).toLowerCase() === '.mdx'
  );
}

export function readMarkdownFiles(directoryPath: string): Node[] {
  const nodes: Node[] = [];

  function getNode(id: string): Node | undefined {
    return nodes.find((item) => item.id === id);
  }

  function readDirectory(currentPath: string): void {
    const items = fs.readdirSync(currentPath);

    items.forEach((item) => {
      if (!validName(item)) return;

      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        readDirectory(itemPath);
      } else if (isMdOrMdxFile(itemPath)) {
        const fileContent = fs.readFileSync(itemPath, 'utf-8');
        const { data } = matter(fileContent);
        const title = extractTitleFromMarkdown(fileContent) as string;

        if (typeof data.references === 'string')
          data.references = [data.references];

        if (typeof data.categories === 'string')
          data.categories = [data.categories];

        nodes.push({
          id: title,
          title,
          linkTo: [...(data.references || [])],
          referencedBy: [...(data.categories || [])],
        });

        if (data.references) {
          data.references.forEach((reference: string) => {
            const node = getNode(reference);
            if (node) {
              node.referencedBy.push(title);
            } else {
              nodes.push({
                id: reference,
                title: reference,
                linkTo: [],
                referencedBy: [title],
              });
            }
          });
        }

        if (data.categories) {
          data.categories.forEach((categorie: string) => {
            const node = getNode(categorie);
            if (node) {
              node.linkTo.push(title);
            } else {
              nodes.push({
                id: categorie,
                title: categorie,
                linkTo: [title],
                referencedBy: [],
              });
            }
          });
        }
      }
    });
  }

  readDirectory(directoryPath);

  return nodes;
}

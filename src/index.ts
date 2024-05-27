import templates from './theme/templates';
import { readMarkdownFiles } from './theme/mdUtils';
import * as fs from 'node:fs';
import * as path from 'node:path';

export default async function docusaurusGraph(context: any) {
  const { siteConfig } = context;
  return {
    name: 'docusaurus-graph',
    async loadContent() {
      const themeConfig = siteConfig.themeConfig;
      themeConfig.navbar.items.push({
        type: 'html',
        position: 'right',
        value: templates.graphButton,
      });
    },

    async contentLoaded() {},

    async postBuild({ plugins }: any) {
      const option = plugins.find((p: any) => p.name === 'docusaurus-graph')
        .options['path'];

      const directoryPath = option ? option : 'docs';
      const nodes = readMarkdownFiles(directoryPath);

      const nodeString = JSON.stringify(nodes, null, 2);
      fs.writeFile(
        path.join('build', 'docusaurus-graph.json'),
        nodeString,
        'utf8',
        (err) => {
          if (err) {
            console.error('Error writing to file :', err);
          }
        }
      );
    },

    injectHtmlTags() {
      return {
        headTags: [...templates.headGraph],
        preBodyTags: [
          {
            tagName: 'style',
            innerHTML: templates.styleGraph,
          },
        ],
        postBodyTags: [
          {
            tagName: 'div',
            innerHTML: templates.containerGraph,
          },
          {
            tagName: 'script',
            innerHTML: templates.scriptGraph,
          },
        ],
      };
    },
  };
}

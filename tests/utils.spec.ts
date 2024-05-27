import { readMarkdownFiles } from '../src/theme/mdUtils';

const nodes = readMarkdownFiles('tests/content');

console.log(nodes);

test('create all nodes from folder', () => {
  expect(nodes.length).toBe(6);
});

test('link nodes from categories tag', () => {
  expect(
    nodes[0].id === 'Congratulations!' && nodes[0].referencedBy[0] === 'docs'
  ).toBe(true);
  expect(
    nodes[1].id === 'docs' && nodes[1].linkTo[0] === 'Congratulations!'
  ).toBe(true);
});

test('link nodes from references tag', () => {
  expect(
    nodes[2].id === 'Deploy your site' && nodes[2].linkTo[0] === 'intro'
  ).toBe(true);
  expect(
    nodes[3].id === 'intro' && nodes[3].referencedBy[0] === 'Deploy your site'
  ).toBe(true);
});

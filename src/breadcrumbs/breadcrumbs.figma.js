// url=https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI?node-id=460%3A2730
const figma = require('figma');

const instance = figma.selectedInstance;

const imports = [
  "import Breadcrumbs from '@jetbrains/ring-ui/components/breadcrumbs/breadcrumbs'",
  "import Link from '@jetbrains/ring-ui/components/link/link'",
];

const children = instance
  .findLayers(() => true)
  .map(layer => layer.textContent)
  .filter(text => text !== '/');

export default {
  id: 'breadcrumbs',
  example: figma.code`${imports.join('\n')}

<Breadcrumbs>
  ${children
    .map((text, index) => {
      const props = [`href="/page${index + 1}"`];
      if (index === children.length - 1) {
        props.push('active');
      }
      return `<Link ${props.map(prop => `${prop} `).join('')}>${text}</Link>`;
    })
    .join('\n  ')}
</Breadcrumbs>`,
};

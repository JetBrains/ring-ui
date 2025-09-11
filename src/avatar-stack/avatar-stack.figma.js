// url=https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI?node-id=5990-752
import figma from '@figma/code-connect';

const instance = figma.selectedInstance;
const sizeString = instance.getString('Size');
const [sizeSubstring] = sizeString.match(/\d+/) ?? [];
const size = parseInt(sizeSubstring, 10);
const children = instance.findConnectedInstances(() => true);

const imports = ["import AvatarStack from '@jetbrains/ring-ui/components/avatar-stack/avatar-stack'"];
const props = [];

const DEFAULT_SIZE = 20;
const isDefaultSize = size === DEFAULT_SIZE;
if (!isDefaultSize) {
  props.push(`size={Size.Size${size}}`);
}

const renderedChildren = children.map(child => {
  const {example} = child.executeTemplate();
  const [childImports, code] = example[0].code.split('\n\n');
  return {imports: childImports, code};
});

export default {
  id: 'avatar-stack',
  example: figma.code`${imports.join('\n')}
${renderedChildren[0].imports}

<AvatarStack ${props.map(prop => `${prop} `).join('')}>
  ${renderedChildren.map(({code}) => code).join('\n  ')}
</AvatarStack>`,
};

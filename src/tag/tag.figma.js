// url=https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI?node-id=7613-9564
// component=Label
// source=https://github.com/JetBrains/ring-ui/blob/d0a0193921db6e40744f7e2f3497272fb990464a/src/tag/tag.tsx
import figma from 'figma';

const instance = figma.selectedInstance;
const text = instance.findText('Text');
const tagType = instance.getEnum('Color', {
  Gray: 'TagType.DEFAULT',
  Blue: 'TagType.MAIN',
  Green: 'TagType.SUCCESS',
  Yellow: 'TagType.WARNING',
  Red: 'TagType.ERROR',
  Purple: 'TagType.PURPLE',
});
const outline = instance.getEnum('Type', {
  Outline: true,
  Solid: false,
});
const disabled = instance.getEnum('State', {
  Default: false,
  Hover: false,
  Disabled: true,
});

if (text.type !== 'TEXT' || !tagType || typeof outline !== 'boolean' || typeof disabled !== 'boolean') {
  throw new Error('Label needs supported Type, Color, and State variants');
}

const imports = ["import Tag, {TagType} from '@jetbrains/ring-ui/components/tag/tag'"];

export default {
  id: 'tag',
  metadata: {nestable: true},
  example: figma.code`${imports.join('\n')}

<Tag
  outline={${outline}}
  tagType={${tagType}}
  disabled={${disabled}}
  readOnly
>
  {${JSON.stringify(text.textContent)}}
</Tag>`,
};

// url=https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI?node-id=9954-528
const figma = require('figma');

const instance = figma.selectedInstance;

const size = instance.getString('Size');
const type = instance.getString('Type');
const state = instance.getString('State');
const variant = instance.getString('Variant');

const imports = ["import Button from '@jetbrains/ring-ui/components/button/button'"];
const props = [];
const DEFAULT_SIZE = 'M';
const isDefaultSize = size === DEFAULT_SIZE;

if (!isDefaultSize) {
  imports.push("import {ControlsHeight} from '@jetbrains/ring-ui/components/global/controls-height'");
  props.push(`height={ControlsHeight.${size}}`);
}

switch (variant) {
  case 'Red outlined':
    props.push('danger');
    break;
  case 'Main':
    props.push('primary');
    break;
  case 'Green':
    props.push('success');
    break;
  case 'Red solid':
    props.push('error');
    break;
  case 'Gray':
    props.push('secondary');
    break;
  case 'Ghost':
    props.push('ghost');
    break;
  case 'Text':
    props.push('inline');
    break;
  default:
}

let children = 'Button';
const use12pxIcon = size === 'S' && variant !== 'Text';
let useButtonGroup = false;
switch (type) {
  case 'R-Icon-Label':
    props.push('dropdown');
    break;
  case 'L-Icon-Label':
    imports.push(`import downloadIcon from '@jetbrains/icons/download${use12pxIcon ? '-12px' : ''}'`);
    props.push('icon={downloadIcon}');
    break;
  case 'Icon':
    children = null;
    imports.push(`import addIcon from '@jetbrains/icons/add${use12pxIcon ? '-12px' : ''}'`);
    props.push('icon={addIcon}');
    break;
  case 'Split':
    imports.push("import ButtonGroup from '@jetbrains/ring-ui/components/button-group/button-group'");
    imports.push(`import chevronDownIcon from '@jetbrains/icons/chevron-down${use12pxIcon ? '-12px' : ''}'`);
    useButtonGroup = true;
    break;
  default:
}

switch (state) {
  case 'Disabled':
    props.push('disabled');
    break;
  default:
}

const joinedProps = props.map(prop => `${prop} `).join('');
// prettier-ignore
const button = children ?
`<Button ${joinedProps}>
  ${children}
</Button>` : `<Button ${joinedProps}/>`;

export default {
  id: 'button',
  example: figma.code`${imports.join('\n')}

${
  // prettier-ignore
  useButtonGroup ?
      `<ButtonGroup>
  ${button}
  <Button ${joinedProps} icon={chevronDownIcon} />
</ButtonGroup>` : button
}`,
};

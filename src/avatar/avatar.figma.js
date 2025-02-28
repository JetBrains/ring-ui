// url=https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI?node-id=5990-522
const figma = require('figma');

const instance = figma.selectedInstance;

const round = instance.getBoolean('Round');
const size = parseInt(instance.getString('Size'), 10);
const content = instance.getString('Content');

const props = [];
const DEFAULT_SIZE = 20;
const isDefaultSize = size === DEFAULT_SIZE;
const imports = [`import Avatar${isDefaultSize ? '' : ', {Size}'} from '@jetbrains/ring-ui/components/avatar/avatar'`];
if (!isDefaultSize) {
  props.push(`size={Size.Size${size}}`);
}
switch (content) {
  case 'color/image':
    props.push('url="avatar.png"');
    break;
  case 'name':
    props.push('username="Samuel Morse"');
    break;
  case 'label':
    props.push(`info="${instance.findText('Content').textContent}"`);
    break;
  case 'icon':
    imports.push(
      "import Icon from '@jetbrains/ring-ui/components/icon/icon'",
      "import warningIcon from '@jetbrains/icons/warning.svg'",
    );
    props.push('info={<Icon glyph={warningIcon} />}');
    break;
  default:
}
if (round) {
  props.push('round');
}

export default {
  id: 'avatar',
  example: figma.code`${imports.join('\n')}

<Avatar ${props.map(prop => `${prop} `).join('')}/>`,
};

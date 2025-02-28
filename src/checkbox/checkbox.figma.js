// url=https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI?node-id=224%3A1943
const figma = require('figma');

const instance = figma.selectedInstance;
const selected = instance.getString('Selected');
const label = instance.getBoolean('Label');
const helpText = instance.getBoolean('Help Text');
const state = instance.getString('State');

const imports = ["import Checkbox from '@jetbrains/ring-ui/components/checkbox/checkbox'"];
const props = [];
switch (selected) {
  case 'selected':
    props.push('defaultChecked');
    break;
  case 'intermediate':
    props.push('indeterminate', 'defaultChecked');
    break;
  default:
}
if (label) {
  props.push(`label="Label"`);
}
if (helpText) {
  props.push(`help="Help text"`);
}
if (state === 'Disabled') {
  props.push('disabled');
}

export default {
  id: 'checkbox',
  example: figma.code`${imports.join('\n')}

<Checkbox ${props.map(prop => `${prop} `).join('')}/>`,
};

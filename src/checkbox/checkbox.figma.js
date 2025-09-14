// url=https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI?node-id=224%3A1943
import figma from '@figma/code-connect';

const instance = figma.selectedInstance;
const selected = instance.getString('Selected');
const hasLabel = instance.getBoolean('Label');
const label = instance.findText('Label').textContent;
const hasHelpText = instance.getBoolean('Help Text');
const helpText = instance.findText('Description').textContent;
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
if (hasLabel) {
  props.push(`label="${label}"`);
}
if (hasHelpText) {
  props.push(`help="${helpText}"`);
}
if (state === 'Disabled') {
  props.push('disabled');
}

export default {
  id: 'checkbox',
  example: figma.code`${imports.join('\n')}

<Checkbox ${props.map(prop => `${prop} `).join('')}/>`,
};

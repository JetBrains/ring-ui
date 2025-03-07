// url=https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI-(Internal)?node-id=7538-7763
const figma = require('figma');

const instance = figma.selectedInstance;
const size = instance.getString('Size');
const state = instance.getString('State');
const formVariant = instance.getBoolean('Form variant');
const icon = instance.getBoolean('Icon');
const clearable = instance.getBoolean('Clearable');
const hasLabel = instance.getBoolean('Label');
const label = instance.findText('Label').textContent;
const hasHelpText = instance.getBoolean('Help text');
const helpText = instance.findText('Help text').textContent;
const hasText = instance.getBoolean('Text');
const text = instance.findText('Text').textContent;
const hasPlaceholder = instance.getBoolean('Placeholder');
const placeholder = instance.findText('Placeholder').textContent;

const imports = ["import Input from '@jetbrains/ring-ui/components/input/input'"];
const props = [];
const DEFAULT_SIZE = 'M';
const isDefaultSize = size === DEFAULT_SIZE;

if (!isDefaultSize) {
  imports.push("import {ControlsHeight} from '@jetbrains/ring-ui/components/global/controls-height'");
  props.push(`height={ControlsHeight.${size}}`);
}

switch (state) {
  case 'disabled':
    props.push('disabled');
    break;
  case 'error':
    props.push('error=""');
    break;
  default:
}

if (formVariant) {
  imports.push("import {LabelType} from '../control-label/control-label'");
  props.push('labelType={LabelType.FORM}');
}

if (icon) {
  imports.push("import searchIcon from '@jetbrains/icons/search'");
  props.push('icon={searchIcon}');
}

if (clearable) {
  props.push('onClear={() => {}}');
}

if (hasLabel) {
  props.push(`label="${label}"`);
}

if (hasHelpText) {
  props.push(`help="${helpText}"`);
}

if (hasText) {
  props.push(`defaultValue="${text}"`);
}

if (hasPlaceholder) {
  props.push(`placeholder="${placeholder}"`);
}

export default {
  id: 'input',
  example: figma.code`${imports.join('\n')}

<Input ${props.map(prop => `${prop} `).join('')}/>`,
};

// url=https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI-(Internal)?node-id=226-2666
const figma = require('figma');

const instance = figma.selectedInstance;
const labelType = instance.getString('Label');
const children = instance.findConnectedInstances(() => true);
const label = instance.findText('Group description').textContent;

const isFormLabel = labelType === 'form';
const imports = [
  `import ControlLabel${isFormLabel ? ', {LabelType}' : ''} from '@jetbrains/ring-ui/components/control-label/control-label'`,
];
const labelProps = [];
if (isFormLabel) {
  labelProps.push('type={LabelType.FORM}');
}

const renderedChildren = children.map(child => {
  const {example} = child.executeTemplate();
  const [childImports, code] = example[0].code.split('\n\n');
  return {imports: childImports, code};
});

export default {
  id: 'checkbox-group',
  example: figma.code`${imports.join('\n')}
${renderedChildren[0].imports}

<ControlLabel ${labelProps.map(prop => `${prop} `).join('')}>${label}</ControlLabel>
${renderedChildren.map(({code}) => code).join('\n<br />\n')}`,
};

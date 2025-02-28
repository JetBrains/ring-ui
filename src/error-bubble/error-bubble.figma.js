// url=https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI-(Internal)?node-id=1228-2869
const figma = require('figma');

const instance = figma.selectedInstance;
const error = instance.findLayers(() => true)[0].textContent;

const imports = ["import ErrorBubble from '@jetbrains/ring-ui/components/error-bubble/error-bubble'"];
const props = [`error={\`${error}\``];

export default {
  id: 'error-bubble',
  example: figma.code`${imports.join('\n')}

<ErrorBubble ${props.map(prop => `${prop} `).join('')}/>`,
};

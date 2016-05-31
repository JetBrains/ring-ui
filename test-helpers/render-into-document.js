/*global mocha*/

import {render, unmountComponentAtNode} from 'react-dom';

let containerNode;

/**
 * Add after each to top-level suite to be sure that the hook will be called before each test
 */
mocha.suite.afterEach(() => {
  let firstChild;

  if (!containerNode || !containerNode.firstChild) {
    return;
  }

  while ((firstChild = containerNode.firstChild)) {
    if (firstChild.__component && firstChild.__component.node) {
      unmountComponentAtNode(firstChild);
    }

    firstChild.__component = null;
    containerNode.removeChild(firstChild);
  }

});

export default function renderIntoDocument(instance, callback) {
  const componentNode = document.createElement('div');

  if (!containerNode) {
    containerNode = document.createElement('div');
    document.body.appendChild(containerNode);
  }

  containerNode.appendChild(componentNode);
  componentNode.__component = render(instance, componentNode, callback);
  return componentNode.__component;
}


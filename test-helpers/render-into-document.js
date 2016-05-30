/* eslint-disable no-var */
/* eslint-disable modules/no-cjs */

var ReactDOM = require('react-dom');

var containerNode;
/**
 * Add after each to top-level suite to be sure that the hook will be called before each test
 */
/*global mocha*/
mocha.suite.afterEach(function () {
  var firstChild;

  if (!containerNode || !containerNode.firstChild) {
    return;
  }

  while ((firstChild = containerNode.firstChild)) {
    if (firstChild.__component && firstChild.__component.node) {
      ReactDOM.unmountComponentAtNode(firstChild);
    }

    firstChild.__component = null;
    containerNode.removeChild(firstChild);
  }

});

function renderIntoDocument(instance, callback) {
  var componentNode = document.createElement('div');

  if (!containerNode) {
    containerNode = document.createElement('div');
    document.body.appendChild(containerNode);
  }

  containerNode.appendChild(componentNode);
  componentNode.__component = ReactDOM.render(instance, componentNode, callback);
  return componentNode.__component;
}

module.exports = renderIntoDocument;

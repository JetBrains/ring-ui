var React = require('react/addons');

var containerNode;

afterEach(function() {
  var firstChild;

  if (!containerNode || !containerNode.firstChild) {
    return;
  }

  while ((firstChild = containerNode.firstChild)) {
    if (firstChild.__component && firstChild.__component.isMounted()) {
      React.unmountComponentAtNode(firstChild);
    }

    firstChild.__component = null;
    containerNode.removeChild(firstChild);
  }

});

function renderIntoDocument(instance, callback) {
  if (!containerNode) {
    containerNode = document.createElement('div');
    document.documentElement.appendChild(containerNode);
  }

  var componentNode = document.createElement('div');
  containerNode.appendChild(componentNode);
  componentNode.__component = React.renderComponent(instance, componentNode, callback);
  return componentNode.__component;
}

module.exports = renderIntoDocument;

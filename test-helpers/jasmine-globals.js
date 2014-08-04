var createTemplateContainer = function (document) {
  var CONTAINER_CLASS = 'jasmine-test-container';
  var container = document.getElementById(CONTAINER_CLASS);

  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', CONTAINER_CLASS);
    document.body.appendChild(container);
  }

  return container;
};
var container = createTemplateContainer(document);

beforeEach(function() {
  this.DOMContainer = container;
});

afterEach(function() {
  this.DOMContainer.innerHTML = '';
});

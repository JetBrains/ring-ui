import {unmountComponentAtNode} from 'react-dom';

beforeEach(function createSandbox() {
  this.sinon = sinon.sandbox.create();
});

afterEach(function restoreSandbox() {
  this.sinon.restore();

  Array.from(document.body.children).forEach(child => {
    if (child.tagName.toLowerCase() === 'div') {
      unmountComponentAtNode(child);
    }
  });
});

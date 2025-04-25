import {getRect, getStyles, isMounted} from './dom';

const nodes: Node[] = [];

function create(tag = 'div') {
  return document.createElement(tag);
}

function attach<T extends Node>(node: T) {
  nodes.push(node);
  return document.body.insertBefore(node, document.body.firstChild);
}

afterEach(() => {
  let node;
  while ((node = nodes.pop())) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
});

describe('DOM', () => {
  describe('isMounted', () => {
    it('should return true for the document', () => {
      expect(isMounted(document)).to.equal(true);
    });

    it('should return true for an element attached to DOM', () => {
      const element = attach(create());
      expect(isMounted(element)).to.equal(true);
    });

    it("should return false for an element that's not attached to DOM", () => {
      const element = create();
      expect(isMounted(element)).to.equal(false);
    });

    it('should return true for textNode attached to DOM', () => {
      const textNode = attach(document.createTextNode('Lorem ipsum dolor sit amet.'));
      expect(isMounted(textNode)).to.equal(true);
    });

    it("should return false for textNode that's not attached to DOM", () => {
      const textNode = document.createTextNode('Lorem ipsum dolor sit amet.');
      expect(isMounted(textNode)).to.equal(false);
    });
  });

  describe('getStyles', () => {
    it("should return css-property that has been set via setAttribute('style')", () => {
      const element = attach(create());
      element.setAttribute('style', 'width: 100px;');

      expect(getStyles(element).width).to.equal('100px');
    });

    it('should return css-property that has been set via style-attribute', () => {
      const element = attach(create());
      element.style.width = '100px';

      expect(getStyles(element).width).to.equal('100px');
    });

    it('should return css-property that has been set before mounting the node', () => {
      const element = attach(create());
      element.style.width = '100px';

      expect(getStyles(element).width).to.equal('100px');
    });
  });

  describe.skip('getRect', () => {
    const style =
      'position: absolute; width: 100px; height: 100px; top: 10px; left: 10px; padding: 3px; margin: 4px; border: 2px solid;';

    it('should return DOMRect-like object for an element', () => {
      const element = attach(create());
      element.setAttribute('style', style);

      expect(getRect(element)).to.deep.equal({top: 14, right: 124, bottom: 124, left: 14, width: 110, height: 110});
    });

    it('should return DOMRect-like stub for unmounted element', () => {
      const element = create();
      element.setAttribute('style', style);

      expect(getRect(element)).to.deep.equal({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0});
    });

    it('should return DOMRect-like object for a range', () => {
      const range = document.createRange();
      range.selectNode(document.body);

      expect(getRect(range)).to.have.all.keys(['top', 'right', 'bottom', 'left', 'width', 'height']);
    });
  });
});

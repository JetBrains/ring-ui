import { isMounted, getStyles, getRect } from './dom';

function create(tag = 'div') {
  return document.createElement(tag);
}

function prepend(node) {
  return document.body.insertBefore(node, document.body.firstChild);
}

describe('DOM', () => {
  describe('isMounted', () => {
    it('should return true for the document', () => {
      isMounted(document).should.equal(true);
    });

    it('should return true for an element attached to DOM', () => {
      let element = create();
      prepend(element);

      isMounted(element).should.equal(true);
    });

    it('should return false for an element that\'s not attached to DOM', () => {
      let element = create();

      isMounted(element).should.equal(false);
    });

    it('should return true for textNode attached to DOM', () => {
      let textNode = document.createTextNode('Lorem ipsum dolor sit amet.');
      prepend(textNode);

      isMounted(textNode).should.equal(true);
    });

    it('should return false for textNode that\'s not attached to DOM', () => {
      let textNode = document.createTextNode('Lorem ipsum dolor sit amet.');

      isMounted(textNode).should.equal(false);
    });
  });

  describe('getStyles', () => {
    it('should return css-property that has been set via setAttribute(\'style\')', () => {
      let element = create();
      prepend(element);
      element.setAttribute('style', 'width: 100px;');

      getStyles(element).width.should.equal('100px');
    });

    it('should return css-property that has been set via style-attribute', () => {
      let element = create();
      prepend(element);
      element.style.width = '100px';

      getStyles(element).width.should.equal('100px');
    });

    it('should return css-property that has been set before mounting the node', () => {
      let element = create();
      element.style.width = '100px';
      prepend(element);

      getStyles(element).width.should.equal('100px');
    });
  });

  describe('getRect', () => {
    const style = 'position: absolute; width: 100px; height: 100px; top: 10px; left: 10px; padding: 3px; margin: 4px; border: 2px solid;';

    it('should return DOMRect-like object for an element', () => {
      let element = create();
      prepend(element);
      element.setAttribute('style', style);

      getRect(element).should.deep.equal({ top: 14, right: 124, bottom: 124, left: 14, width: 110, height: 110 });
    });

    it('should return DOMRect-like stub for unmounting element', () => {
      let element = create();
      element.setAttribute('style', style);

      getRect(element).should.deep.equal({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
    });

    it('should return DOMRect-like object for a range', () => {
      let range = document.createRange();
      range.selectNode(document.body);

      getRect(range).should.have.all.keys(['top', 'right', 'bottom', 'left', 'width', 'height']);
    });
  });
});

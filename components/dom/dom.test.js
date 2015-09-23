import { isMounted, getStyles, getRect } from './dom';

function create(tag) {
  tag = tag || 'div';
  return document.createElement(tag);
}

function prepend(node) {
  return document.body.insertBefore(node, document.body.firstChild);
}

describe('DOM', () => {
  describe('isMounted', () => {
    it('should return true for an element attached to DOM', () => {
      let element = create();
      prepend(element);

      expect(isMounted(element)).to.equal(true);
    });

    it('should return false for an element that\'s not attached to DOM', () => {
      let element = create();

      expect(isMounted(element)).to.equal(false);
    });

    // Doesn't work in PhantomJS
    /*it('should return true for textNode attached to DOM', () => {
      let textNode = document.createTextNode('Lorem ipsum dolor sit amet.')
      prepend(textNode);

      expect(isMounted(textNode)).to.equal(true);
    });*/

    it('should return false for textNode that\'s not attached to DOM', () => {
      let textNode = document.createTextNode('Lorem ipsum dolor sit amet.')

      expect(isMounted(textNode)).to.equal(false);
    });
  });

  describe('getStyles', () => {
    it('should return css-property that has been set via setAttribute(\'style\')', () => {
      let element = create();
      prepend(element);
      element.setAttribute('style', 'width: 100px;');

      expect(getStyles(element).width).to.equal('100px');
    });

    it('should return css-property that has been set via style-attribute', () => {
      let element = create();
      prepend(element);
      element.style.width = '100px';

      expect(getStyles(element).width).to.equal('100px');
    });

    it('should return css-property that has been set before mounting the node', () => {
      let element = create();
      element.style.width = '100px';
      prepend(element);

      expect(getStyles(element).width).to.equal('100px');
    });

    // Doesn't work in Firefox and IE
    /*it('shouldn\'t return css-property for the unmount node', () => {
      let element = create();
      element.style.width = '100px';

      expect(getStyles(element).width).to.equal('');
    });*/
  });

  describe('getRect', () => {
    const style = 'position: absolute; width: 100px; height: 100px; top: 10px; left: 10px; padding: 3px; margin: 4px; border: 2px solid;';

    it('should return DOMRect-like object for an element', () => {
      let element = create();
      prepend(element);
      element.setAttribute('style', style);

      expect(getRect(element)).to.deep.equal({ top: 14, right: 124, bottom: 124, left: 14, width: 110, height: 110 });
    });

    it('should return DOMRect-like stub for unmounting element', () => {
      let element = create();
      element.setAttribute('style', style);

      expect(getRect(element)).to.deep.equal({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
    });

    // Doesn't work in IE
    /*it('should return DOMRect-like object for a range', () => {
      let element = create();
      element.setAttribute('style', style);
      prepend(element);

      let range = document.createRange();
      range.setStartBefore(document.body);
      range.setEndAfter(document.body);

      console.log(getRect(range));

      expect(getRect(range)).to.deep.equal({ top: 8, right: 936, bottom: 8, left: 8, width: 928, height: 0 });
    });*/
  });
});

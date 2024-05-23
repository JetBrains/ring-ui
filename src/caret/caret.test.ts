/* eslint-disable @typescript-eslint/no-magic-numbers */

import Caret from './caret';

describe('Caret', () => {
  let target: HTMLElement;
  let caret: Caret;
  beforeEach(() => {
    target = document.createElement('div');
    target.innerHTML = 'target = document.createElement(textarea)';
    target.style.font = '12px/14px Arial';
    target.contentEditable = 'true';

    document.body.appendChild(target);

    caret = new Caret(target);
  });

  afterEach(() => {
    window.getSelection()?.removeAllRanges();
    // document.body.removeChild(target);
  });

  describe('getPosition', () => {
    it('Default position should be 0', () => {
      window.getSelection()?.removeAllRanges();

      caret.getPosition().should.equal(0);
    });

    it('Should get correct positions', () => {
      window.getSelection()?.collapse(target.firstChild, 10);

      caret.getPosition().should.equal(10);
    });

    it('Should focus on get by default', () => {
      sandbox.spy(target, 'focus');
      caret.getPosition();

      target.focus.should.have.been.called;
    });


    it('Shouldn\'t focus on get when prohibited', () => {
      caret.getPosition({avoidFocus: true});

      target.should.not.equal(document.activeElement);
    });

    it('Should get correct position with simple deep markup', () => {
      target.innerHTML = '<span>foo<span>test<span>hello</span></span><span>123</span></span>';
      window.getSelection()?.collapse(target.children[0].children[0].children[0].firstChild,
        2);
      caret.getPosition().should.equal(9);
    });

    it('Should get correct position with difficult deep markup 2', () => {
      target.innerHTML = '<span>span1<span>span11</span></span><span>span2<span>span21</span>' +
        '</span><span>span3</span>';
      window.getSelection()?.collapse(target.children[1].children[0].firstChild, 4);
      caret.getPosition().should.equal(20);
    });

    it('Should get correct positions for the same node selection - second node', () => {
      target.innerHTML = '<span>span1<span>span11</span></span><span>span2<span>span21</span>' +
        '</span><span>span3</span>';
      const range = new Range();
      const node = target.children[1].children[0].firstChild;
      if (node != null) {
        range.setStart(node, 1);
        range.setEnd(node, 4);
      }
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      caret.getPosition().should.deep.equal({startOffset: 17, endOffset: 20, position: 20});
    });

    it('Should get correct positions for the same node selection - first node', () => {
      target.innerHTML = '<span>span1<span>span11</span></span><span>span2<span>span21</span>' +
        '</span><span>span3</span>';
      const range = new Range();
      range.setStart(target.children[0].childNodes[0], 0);
      range.setEnd(target.children[0].childNodes[0], 5);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      caret.getPosition().should.deep.equal({startOffset: 0, endOffset: 5, position: 5});
    });

    it('Should get correct positions for different nodes selection', () => {
      target.innerHTML = '<span>span1<span>span11</span></span><span>span2<span>span21</span>' +
        '</span><span>span3</span>';
      const range = new Range();
      const startNode = target.children[0].children[0].firstChild;
      startNode && range.setStart(startNode, 1);
      const endNode = target.children[1].children[0].firstChild;
      endNode && range.setEnd(endNode, 4);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      caret.getPosition().should.deep.equal({startOffset: 6, endOffset: 20, position: 20});
    });

    it('Should get correct positions for different nodes selection - whole text', () => {
      target.innerHTML = '<span>span1<span>span11</span></span><span>span2<span>span21</span>' +
        '</span><span>span3</span>';
      const range = new Range();
      range.setStart(target.children[0].childNodes[0], 0);
      const endNode = target.children[2].firstChild;
      endNode && range.setEnd(endNode, 5);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      caret.getPosition().should.deep.equal({startOffset: 0, endOffset: 27, position: 27});
    });
  });

  describe('setPosition', () => {
    it('Shouldn\'t change caret position if we don\'t position', () => {
      should.not.exist(caret.setPosition());

      caret.getPosition().should.equal(0);
    });

    it('Should change caret position if we position', () => {
      caret.setPosition(15);

      caret.getPosition().should.equal(15);
    });
  });

  describe('getOffset', () => {
    it('Should get correct zero offset', () => {
      window.getSelection()?.collapse(target.firstChild, 0);

      caret.getOffset().should.equal(0);
    });
  });
});

import 'dom4';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';
import React from 'react';
import Island, {AdaptiveIsland, Content, Header} from './island';

const LINE_HEIGHT = '28px';

describe('Island', () => {
  const renderComponent = params => renderIntoDocument(<Island {...params}/>);

  it('should create Island component', () => {
    isCompositeComponentWithType(renderComponent(), Island).should.be.true;
  });

  it('should wrap children with div', () => {
    findDOMNode(renderComponent()).should.match('div');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });

  describe('AdaptiveIsland', () => {
    it('should render AdaptiveIsland', () => {
      isCompositeComponentWithType(renderIntoDocument(<AdaptiveIsland/>), AdaptiveIsland).should.be.true;
    });

    it('should change header size if content is scrolled', () => {
      const instance = renderIntoDocument(<AdaptiveIsland>
        <Header/>
        <Content/>
      </AdaptiveIsland>);

      const headerNode = findDOMNode(instance).querySelector('[data-test="ring-island-header"]');

      instance.onContentScroll({scrollTop: 10});
      headerNode.style.lineHeight.should.equal(LINE_HEIGHT);
    });
  });

  describe('Header', () => {
    it('should render header', () => {
      isCompositeComponentWithType(renderIntoDocument(<Header/>), Header).should.be.true;
    });

    it('should change header size', () => {
      const phase = 0.75;
      const node = findDOMNode(renderIntoDocument(<Header phase={phase}/>));
      node.style.lineHeight.should.equal(LINE_HEIGHT);
    });
  });
});

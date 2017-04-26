import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {
  isCompositeComponentWithType,
  renderIntoDocument
} from 'react-dom/test-utils';

import Link, {linkHOC} from './link';
import styles from './link.css';

describe('Link', () => {
  const renderComponent = props => renderIntoDocument(<Link {...props}/>);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Link).should.be.true;
  });

  it('should wrap children with a', () => {
    findDOMNode(renderComponent()).should.match('a');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });

  it('should add active className', () => {
    findDOMNode(renderComponent({active: true})).should.have.class(styles.active);
  });

  it('should add pseudo className', () => {
    findDOMNode(renderComponent({pseudo: true})).should.have.class(styles.pseudo);
  });

  describe('linkHOC', () => {
    it('should wrap with new component', () => {
      const CustomComponent = () => {};

      linkHOC(CustomComponent).should.not.equal(CustomComponent);
    });

    it('should pass activeClassName to wrapped component', () => {
      const CustomComponent = sinon.stub().returns(null);
      const CustomLink = linkHOC(CustomComponent);
      renderIntoDocument(<CustomLink/>);
      CustomComponent.should.have.been.calledWithMatch({activeClassName: styles.active});
    });

    it('should pass custom props to wrapped component', () => {
      const CustomComponent = sinon.stub().returns(null);
      const CustomLink = linkHOC(CustomComponent);

      renderIntoDocument(<CustomLink custom="test"/>);
      CustomComponent.should.have.been.calledWithMatch({custom: 'test'});
    });

    it('should not add activeClassName to tags', () => {
      const CustomComponent = 'a';
      const CustomLink = linkHOC(CustomComponent);

      renderIntoDocument(<CustomLink/>).props.should.not.have.property('activeClassName');
    });
  });
});

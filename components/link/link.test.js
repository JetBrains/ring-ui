import React from 'react';
import {shallow, mount} from 'enzyme';

import Link, {linkHOC} from './link';
import styles from './link.css';

describe('Link', () => {
  const shallowLink = props => shallow(<Link {...props}/>);
  const mountLink = props => mount(<Link {...props}/>);

  it('should create component', () => {
    mountLink().should.have.type(Link);
  });

  it('should wrap children with a', () => {
    shallowLink().should.have.tagName('a');
  });

  it('should use passed className', () => {
    shallowLink({className: 'test-class'}).should.have.className('test-class');
  });

  it('should add active className', () => {
    shallowLink({active: true}).should.have.className(styles.active);
  });

  it('should add pseudo className', () => {
    shallowLink({pseudo: true}).should.have.className(styles.pseudo);
  });

  describe('linkHOC', () => {
    it('should wrap with new component', () => {
      const CustomComponent = () => {};

      linkHOC(CustomComponent).should.not.equal(CustomComponent);
    });

    it('should pass activeClassName to wrapped component', () => {
      const CustomComponent = () => <span/>;
      const CustomLink = linkHOC(CustomComponent);
      mount(<CustomLink/>).should.containMatchingElement(
        <CustomComponent activeClassName={styles.active}/>
      );
    });

    it('should pass custom props to wrapped component', () => {
      const CustomComponent = () => <span/>;
      const CustomLink = linkHOC(CustomComponent);

      mount(<CustomLink custom="test"/>).should.containMatchingElement(
        <CustomComponent custom="test"/>
      );
    });

    it('should not add activeClassName to tags', () => {
      const CustomComponent = 'a';
      const CustomLink = linkHOC(CustomComponent);

      shallow(<CustomLink/>).should.not.have.prop('activeClassName');
    });
  });
});

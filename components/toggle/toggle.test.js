import React from 'react';
import {shallow, mount} from 'enzyme';

import Toggle from './toggle';
import styles from './toggle.css';

describe('Toggle', () => {
  const shallowToggle = props => shallow(<Toggle {...props}/>);
  const mountToggle = props => mount(<Toggle {...props}/>);

  it('should create component', () => {
    mountToggle().should.have.type(Toggle);
  });

  it('should wrap children with label', () => {
    shallowToggle().should.have.tagName('label');
  });

  it('should use passed className', () => {
    shallowToggle({
      className: 'test-class'
    }).should.have.className('test-class');
  });

  it('should render input with type checkbox', () => {
    const toggle = shallowToggle();
    toggle.find('input').should.have.attr('type', 'checkbox');
  });

  it('should render switch', () => {
    const toggle = shallowToggle();
    toggle.find(`.${styles.switch}`).should.exist;
  });
});

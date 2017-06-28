import React from 'react';
import {shallow, mount} from 'enzyme';

import Heading, {H2} from './heading';

describe('Heading', () => {
  const shallowHeading = props => shallow(<Heading {...props}/>);
  const mountHeading = props => mount(<Heading {...props}/>);

  it('should create component', () => {
    mountHeading().should.have.type(Heading);
  });

  it('should wrap children with h1 by default', () => {
    shallowHeading().should.have.tagName('h1');
  });

  it('should accept level prop', () => {
    shallowHeading({level: Heading.Levels.H3}).should.have.tagName('h3');
  });

  it('should export helpers', () => {
    shallow(<H2/>).should.have.tagName('h2');
  });

  it('should use passed className', () => {
    shallowHeading({className: 'test-class'}).should.have.className('test-class');
  });
});

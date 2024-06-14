import {shallow} from 'enzyme';

import Heading, {H2, HeadingProps} from './heading';

describe('Heading', () => {
  const shallowHeading = (props?: HeadingProps) => shallow(<Heading {...props}/>);

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

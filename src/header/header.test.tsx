import {mount} from 'enzyme';

import Header, {HeaderAttrs} from './header';

describe('Header', () => {
  const mountHeader = (props?: HeaderAttrs) => mount(<Header {...props}/>);
  const getHeaderDiv = (props?: HeaderAttrs) => mountHeader(props).find('header');

  it('should create component', () => {
    mountHeader().type().should.equal(Header);
  });

  it('should wrap children with header', () => {
    getHeaderDiv().should.exist;
  });

  it('should use passed className', () => {
    getHeaderDiv({className: 'test-class'}).should.have.className('test-class');
  });
});

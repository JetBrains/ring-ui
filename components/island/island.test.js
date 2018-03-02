import React from 'react';
import {shallow, mount} from 'enzyme';

import Island, {AdaptiveIsland, Content, Header} from './island';

const LINE_HEIGHT = '28px';

describe('Island', () => {
  const shallowIsland = params => shallow(<Island {...params}/>);
  const mountIsland = params => mount(<Island {...params}/>);

  it('should create Island component', () => {
    mountIsland().should.have.type(Island);
  });

  it('should wrap children with div', () => {
    shallowIsland().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowIsland({className: 'test-class'}).should.have.className('test-class');
  });

  it('should join with passed data-test', () => {
    shallowIsland({['data-test']: 'foobar'}).should.have.attr('data-test', 'ring-island foobar');
  });

  describe('AdaptiveIsland', () => {
    it('should render AdaptiveIsland', () => {
      mount(<AdaptiveIsland/>).should.have.type(AdaptiveIsland);
    });

    it('should change header size if content is scrolled', () => {
      const wrapper = mount(
        <AdaptiveIsland>
          <Header/>
          <Content/>
        </AdaptiveIsland>
      );

      const headerNode = wrapper.find('[data-test="ring-island-header"]');

      wrapper.instance().onContentScroll({scrollTop: 10});
      headerNode.should.have.style('line-height', LINE_HEIGHT);
    });
  });

  describe('Header', () => {
    it('should render header', () => {
      mount(<Header/>).should.have.type(Header);
    });

    it('should change header size', () => {
      const phase = 0.75;
      const wrapper = shallow(<Header phase={phase}/>);
      wrapper.should.have.style('line-height', LINE_HEIGHT);
    });
  });
});

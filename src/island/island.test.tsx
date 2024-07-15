import {shallow, mount} from 'enzyme';

import Island, {AdaptiveIsland, Content, Header, IslandProps} from './island';

describe('Island', () => {
  const shallowIsland = (params?: IslandProps) => shallow(<Island {...params}/>);
  const mountIsland = (params?: IslandProps) => mount(<Island {...params}/>);

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
      const wrapper = mount<InstanceType<typeof AdaptiveIsland>>(
        <AdaptiveIsland>
          <Header/>
          <Content/>
        </AdaptiveIsland>
      );

      const headerNode = wrapper.find('[data-test="ring-island-header"]');

      wrapper.instance().onContentScroll({
        scrollTop: 10,
        scrollHeight: 100,
        clientHeight: 50
      } as Element);
      headerNode.should.have.style('line-height', '24px');
    });
  });

  describe('Header', () => {
    it('should render header', () => {
      mount(<Header/>).should.have.type(Header);
    });

    it('should change header size', () => {
      const phase = 0.75;
      const wrapper = shallow(<Header phase={phase}/>);
      wrapper.should.have.style('line-height', '22px');
    });
  });
});

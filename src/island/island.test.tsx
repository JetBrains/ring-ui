import {fireEvent, render, screen} from '@testing-library/react';

import Island, {AdaptiveIsland, Content, Header, IslandProps} from './island';

describe('Island', () => {
  const renderIsland = (params?: IslandProps) => render(<Island {...params} />);

  it('should create Island component', () => {
    renderIsland();
    screen.getByTestId('ring-island').should.exist;
  });

  it('should wrap children with div', () => {
    renderIsland();
    screen.getByTestId('ring-island').should.have.tagName('div');
  });

  it('should use passed className', () => {
    renderIsland({className: 'test-class'});
    screen.getByTestId('ring-island').should.have.class('test-class');
  });

  it('should join with passed data-test', () => {
    renderIsland({['data-test']: 'foobar'});
    screen.getByTestId('ring-island foobar').should.exist;
  });

  describe('AdaptiveIsland', () => {
    it('should render AdaptiveIsland', () => {
      render(<AdaptiveIsland />);
      screen.getByTestId('ring-island').should.exist;
    });

    it('should change header size if content is scrolled', () => {
      vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });

      render(
        <AdaptiveIsland>
          <Header />
          <Content fade />
        </AdaptiveIsland>,
      );

      const headerNode = screen.getByTestId('ring-island-header');
      const scrollableContainer = screen.getByTestId('ring-island-content').firstChild as HTMLElement;

      scrollableContainer.scrollTop = 10;
      Object.defineProperties(scrollableContainer, {
        scrollHeight: {value: 100},
        clientHeight: {value: 50},
      });
      fireEvent.scroll(scrollableContainer);
      headerNode.style.lineHeight.should.equal('24px');
    });
  });

  describe('Header', () => {
    it('should render header', () => {
      render(<Header />);
      screen.getByTestId('ring-island-header').should.exist;
    });

    it('should change header size', () => {
      const phase = 0.75;
      render(<Header phase={phase} />);
      screen.getByTestId('ring-island-header').style.lineHeight.should.equal('22px');
    });
  });
});

import {fireEvent, render, screen} from '@testing-library/react';

import Island, {AdaptiveIsland, Content, Header, type IslandProps} from './island';

describe('Island', () => {
  const renderIsland = (params?: IslandProps) => render(<Island {...params} />);

  it('should create Island component', () => {
    renderIsland();
    expect(screen.getByTestId('ring-island')).to.exist;
  });

  it('should wrap children with div', () => {
    renderIsland();
    expect(screen.getByTestId('ring-island')).to.have.tagName('div');
  });

  it('should use passed className', () => {
    renderIsland({className: 'test-class'});
    expect(screen.getByTestId('ring-island')).to.have.class('test-class');
  });

  it('should join with passed data-test', () => {
    renderIsland({['data-test']: 'foobar'});
    expect(screen.getByTestId('ring-island foobar')).to.exist;
  });

  describe('AdaptiveIsland', () => {
    it('should render AdaptiveIsland', () => {
      render(<AdaptiveIsland />);
      expect(screen.getByTestId('ring-island')).to.exist;
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
      expect(headerNode.style.lineHeight).to.equal('24px');
    });
  });

  describe('Header', () => {
    it('should render header', () => {
      render(<Header />);
      expect(screen.getByTestId('ring-island-header')).to.exist;
    });

    it('should change header size', () => {
      const phase = 0.75;
      render(<Header phase={phase} />);
      expect(screen.getByTestId('ring-island-header').style.lineHeight).to.equal('22px');
    });
  });
});

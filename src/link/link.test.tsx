import {type ComponentType} from 'react';
import * as React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';

import Link, {linkHOC, type LinkProps} from './link';
import ClickableLink, {type ClickableLinkProps} from './clickable-link';
import styles from './link.css';

describe('Link', () => {
  const renderLink = (props?: Partial<LinkProps>) => {
    render(<Link {...{children: '', ...props}} />);
  };

  it('should wrap children with a link', () => {
    renderLink({href: '/'});
    expect(screen.getByRole('link')).to.exist;
  });

  it('should wrap children with a link if href is empty string', () => {
    renderLink({href: ''});
    expect(screen.getByTestId('ring-link')).to.have.tagName('a');
  });

  it('should wrap children with button if no href', () => {
    renderLink({});
    expect(screen.getByRole('button')).to.exist;
  });

  it('should use passed className', () => {
    renderLink({className: 'test-class'});
    expect(screen.getByRole('button')).to.have.class('test-class');
  });

  it('should add active className', () => {
    renderLink({active: true});
    expect(screen.getByRole('button')).to.have.class(styles.active);
  });

  it('should render button for pseudo links', () => {
    renderLink({href: '/', pseudo: true});
    expect(screen.getByRole('button')).to.exist;
  });

  describe('linkHOC', () => {
    it('should wrap with new component', () => {
      const CustomComponent = () => null;

      expect(linkHOC(CustomComponent)).to.not.equal(CustomComponent);
    });

    it('should pass activeClassName to wrapped component', () => {
      const CustomComponent: ComponentType<ClickableLinkProps> = () => <span data-test='custom-component' />;
      const CustomLink = linkHOC(CustomComponent);
      render(<CustomLink>{null}</CustomLink>);
      expect(screen.getByTestId('custom-component')).to.exist;
    });

    it('should pass custom props to wrapped component', () => {
      // eslint-disable-next-line react/prop-types
      const CustomComponent: ComponentType<ClickableLinkProps & {custom: string}> = ({custom}) => (
        <span data-test={custom} />
      );
      const CustomLink = linkHOC(CustomComponent);

      render(<CustomLink custom='test'>{null}</CustomLink>);
      expect(screen.getByTestId('test')).to.exist;
    });

    it('should not add activeClassName to tags', () => {
      const CustomComponent = 'a';
      const CustomLink = linkHOC(CustomComponent);

      render(<CustomLink href='/'>{''}</CustomLink>);
      expect(screen.getByRole('link')).to.not.have.attr('activeClassName');
    });
  });

  describe('ClickableLink', () => {
    it('should render "a" tag', () => {
      render(<ClickableLink href='/'>{'foo'}</ClickableLink>);
      const link = screen.getByRole('link');
      expect(link).to.have.attr('href', '/');
      expect(link).to.have.text('foo');
    });

    describe('events', () => {
      const Buttons = {
        LEFT: 0,
        MIDDLE: 1,
        RIGHT: 2,
      };

      let onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
      let onConditionalClick: (isPlainLeft: boolean, e: React.MouseEvent<HTMLAnchorElement>) => void;
      let onPlainLeftClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;

      beforeEach(() => {
        onClick = vi.fn();
        onConditionalClick = vi.fn();
        onPlainLeftClick = vi.fn();
        render(
          <ClickableLink
            onClick={onClick}
            onConditionalClick={onConditionalClick}
            onPlainLeftClick={onPlainLeftClick}
            href='/'
          >
            {'foo'}
          </ClickableLink>,
        );
      });

      it('should handle a plain left click', () => {
        const link = screen.getByRole('link');
        const e = {button: Buttons.LEFT};
        fireEvent.click(link, e);

        expect(onClick).toHaveBeenCalledWith(expect.objectContaining({...e, defaultPrevented: true}));
        expect(onConditionalClick).toHaveBeenCalledWith(true, expect.objectContaining(e));
        expect(onPlainLeftClick).toHaveBeenCalledWith(expect.objectContaining(e));
      });

      it('should handle a middle click', () => {
        const link = screen.getByRole('link');
        const e = {button: Buttons.MIDDLE};
        fireEvent.click(link, e);

        expect(onClick).toHaveBeenCalledWith(expect.objectContaining({...e, defaultPrevented: false}));
        expect(onConditionalClick).toHaveBeenCalledWith(false, expect.objectContaining(e));
        expect(onPlainLeftClick).not.toHaveBeenCalled;
      });

      it('should handle alt+click', () => {
        const link = screen.getByRole('link');
        const e = {button: Buttons.LEFT, altKey: true};
        fireEvent.click(link, e);

        expect(onClick).toHaveBeenCalledWith(expect.objectContaining({...e, defaultPrevented: false}));
        expect(onConditionalClick).toHaveBeenCalledWith(false, expect.objectContaining(e));
        expect(onPlainLeftClick).not.toHaveBeenCalled;
      });

      it('should handle ctrl+click', () => {
        const link = screen.getByRole('link');
        const e = {button: Buttons.LEFT, ctrlKey: true};
        fireEvent.click(link, e);

        expect(onClick).toHaveBeenCalledWith(expect.objectContaining({...e, defaultPrevented: false}));
        expect(onConditionalClick).toHaveBeenCalledWith(false, expect.objectContaining(e));
        expect(onPlainLeftClick).not.toHaveBeenCalled;
      });

      it('should handle cmd+click / win+click', () => {
        const link = screen.getByRole('link');
        const e = {button: Buttons.LEFT, metaKey: true};
        fireEvent.click(link, e);

        expect(onClick).toHaveBeenCalledWith(expect.objectContaining({...e, defaultPrevented: false}));
        expect(onConditionalClick).toHaveBeenCalledWith(false, expect.objectContaining(e));
        expect(onPlainLeftClick).not.toHaveBeenCalled;
      });

      it('should handle shift+click', () => {
        const link = screen.getByRole('link');
        const e = {button: Buttons.LEFT, shiftKey: true};
        fireEvent.click(link, e);

        expect(onClick).toHaveBeenCalledWith(expect.objectContaining({...e, defaultPrevented: false}));
        expect(onConditionalClick).toHaveBeenCalledWith(false, expect.objectContaining(e));
        expect(onPlainLeftClick).not.toHaveBeenCalled;
      });
    });
  });
});

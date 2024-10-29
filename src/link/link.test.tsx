import {ComponentType} from 'react';
import * as React from 'react';

import {fireEvent, render, screen} from '@testing-library/react';

import Link, {linkHOC, LinkProps} from './link';
import ClickableLink, {ClickableLinkProps} from './clickableLink';
import styles from './link.css';

describe('Link', () => {
  const renderLink = (props?: Partial<LinkProps>) => {
    render(<Link {...{children: '', ...props}} />);
  };

  it('should wrap children with a link', () => {
    renderLink({href: '/'});
    screen.getByRole('link').should.exist;
  });

  it('should wrap children with a link if href is empty string', () => {
    renderLink({href: ''});
    screen.getByTestId('ring-link').should.have.tagName('a');
  });

  it('should wrap children with button if no href', () => {
    renderLink({});
    screen.getByRole('button').should.exist;
  });

  it('should use passed className', () => {
    renderLink({className: 'test-class'});
    screen.getByRole('button').should.have.class('test-class');
  });

  it('should add active className', () => {
    renderLink({active: true});
    screen.getByRole('button').should.have.class(styles.active);
  });

  it('should render button for pseudo links', () => {
    renderLink({href: '/', pseudo: true});
    screen.getByRole('button').should.exist;
  });

  describe('linkHOC', () => {
    it('should wrap with new component', () => {
      const CustomComponent = () => null;

      linkHOC(CustomComponent).should.not.equal(CustomComponent);
    });

    it('should pass activeClassName to wrapped component', () => {
      const CustomComponent: ComponentType<ClickableLinkProps> = () => <span data-test="custom-component" />;
      const CustomLink = linkHOC(CustomComponent);
      render(<CustomLink>{null}</CustomLink>);
      screen.getByTestId('custom-component').should.exist;
    });

    it('should pass custom props to wrapped component', () => {
      const CustomComponent: ComponentType<ClickableLinkProps & {custom: string}> = ({custom}) => (
        <span data-test={custom} />
      );
      const CustomLink = linkHOC(CustomComponent);

      render(<CustomLink custom="test">{null}</CustomLink>);
      screen.getByTestId('test').should.exist;
    });

    it('should not add activeClassName to tags', () => {
      const CustomComponent = 'a';
      const CustomLink = linkHOC(CustomComponent);

      render(<CustomLink href="/">{''}</CustomLink>);
      screen.getByRole('link').should.not.have.attr('activeClassName');
    });
  });

  describe('ClickableLink', () => {
    it('should render "a" tag', () => {
      render(<ClickableLink href="/">{'foo'}</ClickableLink>);
      const link = screen.getByRole('link');
      link.should.have.attr('href', '/');
      link.should.have.text('foo');
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
        onClick = sandbox.spy();
        onConditionalClick = sandbox.spy();
        onPlainLeftClick = sandbox.spy();
        render(
          <ClickableLink
            onClick={onClick}
            onConditionalClick={onConditionalClick}
            onPlainLeftClick={onPlainLeftClick}
            href="/"
          >
            {'foo'}
          </ClickableLink>,
        );
      });

      it('should handle a plain left click', () => {
        const link = screen.getByRole('link');
        const e = {button: Buttons.LEFT};
        fireEvent.click(link, e);

        onClick.should.have.been.calledWithMatch({...e, defaultPrevented: true});
        onConditionalClick.should.have.been.calledWithMatch(true, e);
        onPlainLeftClick.should.have.been.calledWithMatch(e);
      });

      it('should handle a middle click', () => {
        const link = screen.getByRole('link');
        const e = {button: Buttons.MIDDLE};
        fireEvent.click(link, e);

        onClick.should.have.been.calledWithMatch({...e, defaultPrevented: false});
        onConditionalClick.should.have.been.calledWithMatch(false, e);
        onPlainLeftClick.should.not.have.been.called;
      });

      it('should handle alt+click', () => {
        const link = screen.getByRole('link');
        const e = {button: Buttons.LEFT, altKey: true};
        fireEvent.click(link, e);

        onClick.should.have.been.calledWithMatch({...e, defaultPrevented: false});
        onConditionalClick.should.have.been.calledWithMatch(false, e);
        onPlainLeftClick.should.not.have.been.called;
      });

      it('should handle ctrl+click', () => {
        const link = screen.getByRole('link');
        const e = {button: Buttons.LEFT, ctrlKey: true};
        fireEvent.click(link, e);

        onClick.should.have.been.calledWithMatch({...e, defaultPrevented: false});
        onConditionalClick.should.have.been.calledWithMatch(false, e);
        onPlainLeftClick.should.not.have.been.called;
      });

      it('should handle cmd+click / win+click', () => {
        const link = screen.getByRole('link');
        const e = {button: Buttons.LEFT, metaKey: true};
        fireEvent.click(link, e);

        onClick.should.have.been.calledWithMatch({...e, defaultPrevented: false});
        onConditionalClick.should.have.been.calledWithMatch(false, e);
        onPlainLeftClick.should.not.have.been.called;
      });

      it('should handle shift+click', () => {
        const link = screen.getByRole('link');
        const e = {button: Buttons.LEFT, shiftKey: true};
        fireEvent.click(link, e);

        onClick.should.have.been.calledWithMatch({...e, defaultPrevented: false});
        onConditionalClick.should.have.been.calledWithMatch(false, e);
        onPlainLeftClick.should.not.have.been.called;
      });
    });
  });
});

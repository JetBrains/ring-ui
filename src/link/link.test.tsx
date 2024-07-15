import {ComponentType} from 'react';
import * as React from 'react';
import {shallow, mount, ShallowWrapper} from 'enzyme';

import Link, {linkHOC, LinkProps} from './link';
import ClickableLink, {ClickableLinkProps} from './clickableLink';
import styles from './link.css';

describe('Link', () => {
  const shallowLink = (props?: Partial<LinkProps>) =>
    shallow(<Link {...{children: '', ...props}}/>);
  const mountLink = (props?: Partial<LinkProps>) =>
    mount(<Link {...{children: '', ...props}}/>);

  it('should create component', () => {
    mountLink().should.have.type(Link);
  });

  it('should wrap children with ClickableLink', () => {
    shallowLink({href: '/'}).should.have.type(ClickableLink);
  });

  it('should wrap children with ClickableLink if href is empty string', () => {
    shallowLink({href: ''}).should.have.type(ClickableLink);
  });

  it('should wrap children with button if no href', () => {
    shallowLink({}).should.have.type('button');
  });

  it('should use passed className', () => {
    shallowLink({className: 'test-class'}).should.have.className('test-class');
  });

  it('should add active className', () => {
    shallowLink({active: true}).should.have.className(styles.active);
  });

  it('should render button for pseudo links', () => {
    shallowLink().should.have.tagName('button');
    shallowLink({href: '/', pseudo: true}).should.have.tagName('button');
  });

  describe('linkHOC', () => {
    it('should wrap with new component', () => {
      const CustomComponent = () => null;

      linkHOC(CustomComponent).should.not.equal(CustomComponent);
    });

    it('should pass activeClassName to wrapped component', () => {
      const CustomComponent: ComponentType<ClickableLinkProps> = () => <span/>;
      const CustomLink = linkHOC(CustomComponent);
      mount(<CustomLink>{null}</CustomLink>).should.containMatchingElement(
        <CustomComponent activeClassName={styles.active}/>
      );
    });

    it('should pass custom props to wrapped component', () => {
      const CustomComponent: ComponentType<ClickableLinkProps & {custom: string}> = () => <span/>;
      const CustomLink = linkHOC(CustomComponent);

      mount(<CustomLink custom="test">{null}</CustomLink>).should.containMatchingElement(
        <CustomComponent custom="test"/>
      );
    });

    it('should not add activeClassName to tags', () => {
      const CustomComponent = 'a';
      const CustomLink = linkHOC(CustomComponent);

      shallow(<CustomLink>{''}</CustomLink>).should.not.have.prop('activeClassName');
    });
  });

  describe('ClickableLink', () => {
    it('should render "a" tag', () => {
      shallow(<ClickableLink href="/">{'foo'}</ClickableLink>).should.containMatchingElement(<a href="/">{'foo'}</a>);
    });

    describe('events', () => {
      const Buttons = {
        LEFT: 0,
        MIDDLE: 1,
        RIGHT: 2
      };

      let onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
      let onConditionalClick:
        (isPlainLeft: boolean, e: React.MouseEvent<HTMLAnchorElement>) => void;
      let onPlainLeftClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
      let wrapper: ShallowWrapper;

      const makeEvent = (e: Partial<MouseEvent>) => ({
        ...e,
        preventDefault: sandbox.spy()
      });

      beforeEach(() => {
        onClick = sandbox.spy();
        onConditionalClick = sandbox.spy();
        onPlainLeftClick = sandbox.spy();
        wrapper = shallow(
          <ClickableLink
            onClick={onClick}
            onConditionalClick={onConditionalClick}
            onPlainLeftClick={onPlainLeftClick}
            href="/"
          >{'foo'}</ClickableLink>
        );
      });

      it('should handle a plain left click', () => {
        const e = makeEvent({button: Buttons.LEFT});
        wrapper.simulate('click', e);

        onClick.should.have.been.calledWith(e);
        onConditionalClick.should.have.been.calledWith(true, e);
        onPlainLeftClick.should.have.been.calledWith(e);
        e.preventDefault.should.have.been.calledOnce;
      });

      it('should handle a middle click', () => {
        const e = makeEvent({button: Buttons.MIDDLE});
        wrapper.simulate('click', e);

        onClick.should.have.been.calledWith(e);
        onConditionalClick.should.have.been.calledWith(false, e);
        onPlainLeftClick.should.not.have.been.called;
        e.preventDefault.should.not.have.been.called;
      });

      it('should handle a right click', () => {
        const e = makeEvent({button: Buttons.RIGHT});
        wrapper.simulate('click', e);

        onClick.should.have.been.calledWith(e);
        onConditionalClick.should.have.been.calledWith(false, e);
        onPlainLeftClick.should.not.have.been.called;
        e.preventDefault.should.not.have.been.called;
      });

      it('should handle alt+click', () => {
        const e = makeEvent({button: Buttons.LEFT, altKey: true});
        wrapper.simulate('click', e);

        onClick.should.have.been.calledWith(e);
        onConditionalClick.should.have.been.calledWith(false, e);
        onPlainLeftClick.should.not.have.been.called;
        e.preventDefault.should.not.have.been.called;
      });

      it('should handle ctrl+click', () => {
        const e = makeEvent({button: Buttons.LEFT, ctrlKey: true});
        wrapper.simulate('click', e);

        onClick.should.have.been.calledWith(e);
        onConditionalClick.should.have.been.calledWith(false, e);
        onPlainLeftClick.should.not.have.been.called;
        e.preventDefault.should.not.have.been.called;
      });

      it('should handle cmd+click / win+click', () => {
        const e = makeEvent({button: Buttons.LEFT, metaKey: true});
        wrapper.simulate('click', e);

        onClick.should.have.been.calledWith(e);
        onConditionalClick.should.have.been.calledWith(false, e);
        onPlainLeftClick.should.not.have.been.called;
        e.preventDefault.should.not.have.been.called;
      });

      it('should handle shift+click', () => {
        const e = makeEvent({button: Buttons.LEFT, shiftKey: true});
        wrapper.simulate('click', e);

        onClick.should.have.been.calledWith(e);
        onConditionalClick.should.have.been.calledWith(false, e);
        onPlainLeftClick.should.not.have.been.called;
        e.preventDefault.should.not.have.been.called;
      });
    });
  });
});

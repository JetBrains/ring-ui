import React from 'react';
import {shallow, mount} from 'enzyme';

import Link, {linkHOC} from './link';
import ClickableLink from './clickableLink';
import styles from './link.css';

function noop() {}

describe('Link', () => {
  const shallowLink = props => shallow(<Link {...props}/>);
  const mountLink = props => mount(<Link {...props}/>);

  it('should create component', () => {
    mountLink().should.have.type(Link);
  });

  it('should wrap children with ClickableLink', () => {
    shallowLink({href: '/'}).should.have.type(ClickableLink);
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
      const CustomComponent = () => {};

      linkHOC(CustomComponent).should.not.equal(CustomComponent);
    });

    it('should pass activeClassName to wrapped component', () => {
      const CustomComponent = () => <span/>;
      const CustomLink = linkHOC(CustomComponent);
      mount(<CustomLink>{noop}</CustomLink>).should.containMatchingElement(
        <CustomComponent activeClassName={styles.active}/>
      );
    });

    it('should pass custom props to wrapped component', () => {
      const CustomComponent = () => <span/>;
      const CustomLink = linkHOC(CustomComponent);

      mount(<CustomLink custom="test">{noop}</CustomLink>).should.containMatchingElement(
        <CustomComponent custom="test"/>
      );
    });

    it('should not add activeClassName to tags', () => {
      const CustomComponent = 'a';
      const CustomLink = linkHOC(CustomComponent);

      shallow(<CustomLink/>).should.not.have.prop('activeClassName');
    });
  });

  describe('ClickableLink', () => {
    it('should render "a" tag', () => {
      shallow(<ClickableLink href="/"/>).should.containMatchingElement(<a href="/"/>);
    });

    describe('events', () => {
      const Buttons = {
        LEFT: 0,
        MIDDLE: 1,
        RIGHT: 2
      };

      let onClick;
      let onPlainLeftClick;
      let wrapper;

      const makeEvent = e => ({
        ...e,
        preventDefault: sandbox.spy()
      });

      beforeEach(() => {
        onClick = sandbox.spy();
        onPlainLeftClick = sandbox.spy();
        wrapper = shallow(<ClickableLink onClick={onClick} onPlainLeftClick={onPlainLeftClick}/>);
      });

      it('should call onClick and onPlainLeftClick on a plain left click', () => {
        const e = makeEvent({button: Buttons.LEFT});
        wrapper.simulate('click', e);

        onClick.should.have.been.calledWith(e);
        onPlainLeftClick.should.have.been.calledWith(e);
        e.preventDefault.should.have.been.calledOnce;
      });

      it('should call only onClick on a middle click', () => {
        const e = makeEvent({button: Buttons.MIDDLE});
        wrapper.simulate('click', e);

        onClick.should.have.been.calledWith(e);
        onPlainLeftClick.should.not.have.been.called;
        e.preventDefault.should.not.have.been.called;
      });

      it('should call only onClick on a right click', () => {
        const e = makeEvent({button: Buttons.RIGHT});
        wrapper.simulate('click', e);

        onClick.should.have.been.calledWith(e);
        onPlainLeftClick.should.not.have.been.called;
        e.preventDefault.should.not.have.been.called;
      });

      it('should call only onClick on alt+click', () => {
        const e = makeEvent({button: Buttons.LEFT, altKey: true});
        wrapper.simulate('click', e);

        onClick.should.have.been.calledWith(e);
        onPlainLeftClick.should.not.have.been.called;
        e.preventDefault.should.not.have.been.called;
      });

      it('should call only onClick on ctrl+click', () => {
        const e = makeEvent({button: Buttons.LEFT, ctrlKey: true});
        wrapper.simulate('click', e);

        onClick.should.have.been.calledWith(e);
        onPlainLeftClick.should.not.have.been.called;
        e.preventDefault.should.not.have.been.called;
      });

      it('should call only onClick on cmd+click / win+click', () => {
        const e = makeEvent({button: Buttons.LEFT, metaKey: true});
        wrapper.simulate('click', e);

        onClick.should.have.been.calledWith(e);
        onPlainLeftClick.should.not.have.been.called;
        e.preventDefault.should.not.have.been.called;
      });

      it('should call only onClick on shift+click', () => {
        const e = makeEvent({button: Buttons.LEFT, shiftKey: true});
        wrapper.simulate('click', e);

        onClick.should.have.been.calledWith(e);
        onPlainLeftClick.should.not.have.been.called;
        e.preventDefault.should.not.have.been.called;
      });
    });
  });
});

import React from 'react';

import renderIntoDocument from 'render-into-document';
import simulateKeypress from 'simulate-keypress';

import RingComponentWithShortcuts from './ring-component_with-shortcuts';
import shortcuts from '../shortcuts/shortcuts';

describe('RingComponentWithShortcuts', () => {
  //const component;
  const noop = sinon.spy();
  //const noop2;
  const key = 'a';
  const scope = 'scope scope scope';
  //const scope2 = 'scope2 scope2 scope2';
  const keyMap = {};
  keyMap[key] = noop;

  function trigger() {
    simulateKeypress(key, 65);
  }

  beforeEach(() => {
    const stub = this.stub = this.sinon.stub();
    shortcuts.reset();

    class TestComponent extends RingComponentWithShortcuts {
      getShortcutsProps() {
        return {
          scope,
          map: {
            [key]: stub
          }
        };
      }

      render() {
        return <div/>;
      }
    }

    this.TestComponent = TestComponent;
    this.component = renderIntoDocument(React.createElement(TestComponent, {
      shortcuts: true
    }));
  });

  //function createСomponent(props, callback) {
  //  const TestClass = createСlass();
  //  component = renderIntoDocument(React.createElement(TestClass, props), callback);
  //}
  //
  //function createСomponentWithSubComponent(props, callback) {
  //  const subKeyMap = {};
  //  subKeyMap[key] = noop2;
  //
  //  const subComponent = createСlass({
  //    scope: scope2,
  //    map: subKeyMap
  //  });
  //
  //  const TestClass = createСlass(null, function render() {
  //    return React.createElement(subComponent, {
  //      ref: 'subComponent',
  //      shortcuts: this.props.shortcuts
  //    }, null);
  //  });
  //
  //  component = renderIntoDocument(React.createElement(TestClass, props), callback);
  //}

  it('should throw with wrong config', () => {
    function createWrongComponent() {
      class WrongComponent extends RingComponentWithShortcuts {
        getShortcutsProps() {
          return {};
        }

        render() {
          return <div/>;
        }
      }

      renderIntoDocument(React.createElement(WrongComponent, {
        shortcuts: true
      }));
    }

    createWrongComponent.should.throw(Error);
  });

  it('should not activate shortcuts without param', () => {
    shortcuts.reset();
    renderIntoDocument(React.createElement(this.TestComponent));

    shortcuts.getScope().should.be.empty;
  });

  it('shorcutsEnabled should reflect shortcuts disabled state', () => {
    const component = renderIntoDocument(React.createElement(this.TestComponent));

    component.shortcutsEnabled().should.be.false;
  });

  it('shorcutsEnabled should reflect shortcuts enabled state', () => {
    this.component.shortcutsEnabled().should.be.true;
  });

  it('should activate shortcuts on component', () => {
    shortcuts.getScope().should.deep.equal([shortcuts.wrapScope(scope)]);
    this.component.shortcutsScope.should.equal(scope);
  });

  it('should lazy activate shortcuts', () => {
    this.component.rerender({
      shortcuts: true
    });

    shortcuts.getScope().should.deep.equal([shortcuts.wrapScope(scope)]);
    this.component.shortcutsScope.should.equal(scope);
  });

  it('should trigger handlers bound on component', () => {
    renderIntoDocument(React.createElement(this.TestComponent, {
      shortcuts: true
    }));

    trigger();
    this.stub.should.have.been.called.once;
  });

  it('should disable shortcuts on component', () => {
    this.component.rerender({
      shortcuts: false
    });

    shortcuts.getScope().should.be.empty;
  });

  it('should not trigger on component with disabled shortcuts', () => {
    this.component.rerender({
      shortcuts: false
    });

    trigger();
    this.stub.should.not.have.been.called;
  });
  //
  //it('should trigger on subcomponent which shadows component\'s shortcut', () => {
  //  createСomponentWithSubComponent({
  //    shortcuts: true
  //  });
  //
  //  trigger();
  //  noop.should.not.have.been.called;
  //  noop2.should.have.been.called;
  //});
  //
  //it('should disable shortcuts on component and subcomponent', () => {
  //  createСomponentWithSubComponent({
  //    shortcuts: true
  //  });
  //
  //  component.setProps({
  //    shortcuts: false
  //  });
  //
  //  shortcuts.getScope().should.be.empty;
  //});
  //
  //it('should disable shortcuts on subcomponent', () => {
  //  createСomponentWithSubComponent({
  //    shortcuts: true
  //  });
  //
  //  component.refs.subComponent.setState({
  //    shortcuts: false
  //  });
  //
  //  shortcuts.getScope().should.deep.equal([scope]);
  //});
});

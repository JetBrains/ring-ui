/* eslint-disable func-names */

import React from 'react';

import renderIntoDocument from 'render-into-document';
import simulateKeypress from 'simulate-keypress';

import RingComponentWithShortcuts from './ring-component_with-shortcuts';
import shortcuts from '../shortcuts/shortcuts';

describe('Ring Component With Shortcuts', () => {
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

  beforeEach(function () {
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

  it('should not activate shortcuts without param', function () {
    shortcuts.reset();
    renderIntoDocument(React.createElement(this.TestComponent));

    shortcuts.getScope().should.be.empty;
  });

  it('shortcutsEnabled should reflect shortcuts disabled state', function () {
    const component = renderIntoDocument(React.createElement(this.TestComponent));

    component.shortcutsEnabled().should.be.false;
  });

  it('shortcutsEnabled should reflect shortcuts enabled state', function () {
    this.component.shortcutsEnabled().should.be.true;
  });

  it('should activate shortcuts on component', function () {
    shortcuts.getScope().should.deep.equal([shortcuts.wrapScope(scope)]);
    this.component.shortcutsScope.should.equal(scope);
  });

  it('should lazy activate shortcuts', function () {
    this.component.rerender({
      shortcuts: true
    });

    shortcuts.getScope().should.deep.equal([shortcuts.wrapScope(scope)]);
    this.component.shortcutsScope.should.equal(scope);
  });

  it('should trigger handlers bound on component', function () {
    renderIntoDocument(React.createElement(this.TestComponent, {
      shortcuts: true
    }));

    trigger();
    this.stub.should.have.been.called.once;
  });

  it('should disable shortcuts on component', function () {
    this.component.rerender({
      shortcuts: false
    });

    shortcuts.getScope().should.be.empty;
  });

  it('should not trigger on component with disabled shortcuts', function () {
    this.component.rerender({
      shortcuts: false
    });

    trigger();
    this.stub.should.not.have.been.called;
  });
});

import React from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';
import guid from 'mout/random/guid';

import shortcuts from '../shortcuts/core';
import simulateCombo from '../../test-helpers/simulate-combo';

import RingComponentWithShortcuts from './ring-component_with-shortcuts';

describe('Ring Component With Shortcuts', () => {
  //const component;
  const noop = sandbox.spy();
  //const noop2;
  const key = 'a';
  //const scope2 = 'scope2 scope2 scope2';
  const keyMap = {};
  keyMap[key] = noop;

  function trigger() {
    simulateCombo(key);
  }

  let stub;

  beforeEach(() => {
    stub = sandbox.stub();
    shortcuts.reset();
  });

  class TestComponent extends RingComponentWithShortcuts {
    constructor(params = {}) {
      const defaultShortcutsProps = {
        map: {
          [key]: stub
        },
        options: {}
      };

      super();
      this.scope = guid();
      this.shortcutsProps = params.shortcutsProps || defaultShortcutsProps;

      this.shortcutsProps.scope = this.scope;
    }

    getShortcutsProps() {
      return this.shortcutsProps;
    }

    render() {
      return <div/>;
    }
  }


  describe('test as react component', () => {
    let component;
    beforeEach(() => {
      component = renderIntoDocument(React.createElement(TestComponent, {
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

    it('should not activate shortcuts without param', () => {
      shortcuts.reset();
      renderIntoDocument(React.createElement(TestComponent));

      shortcuts.getScope().should.be.empty;
    });

    it('shortcutsEnabled should reflect shortcuts disabled state', () => {
      const newComponent = renderIntoDocument(React.createElement(TestComponent));

      newComponent.shortcutsEnabled().should.be.false;
    });

    it('shortcutsEnabled should reflect shortcuts enabled state', () => {
      component.shortcutsEnabled().should.be.true;
    });

    it('should activate shortcuts on component', () => {
      shortcuts.getScope().
        should.
        deep.
        equal([shortcuts.wrapScope(component.scope)]);
      component.shortcutsScope.should.equal(component.scope);
    });

    it('should lazy activate shortcuts', () => {
      component.rerender({
        shortcuts: true
      });

      shortcuts.getScope().
        should.
        deep.
        equal([shortcuts.wrapScope(component.scope)]);
      component.shortcutsScope.should.equal(component.scope);
    });

    it('should trigger handlers bound on component', () => {
      renderIntoDocument(React.createElement(TestComponent, {
        shortcuts: true
      }));

      trigger();
      stub.should.have.been.calledOnce;
    });

    it('should disable shortcuts on component', () => {
      component.rerender({
        shortcuts: false
      });

      shortcuts.getScope().should.be.empty;
    });

    it('should not trigger on component with disabled shortcuts', () => {
      component.rerender({
        shortcuts: false
      });

      trigger();
      stub.should.not.have.been.called;
    });
  });


  describe('toggleShortcuts', () => {

    function getShortcutsScopeFor(scope) {
      return shortcuts.getScope().
        filter(s => s.scopeId === scope) [0];
    }

    let component;
    beforeEach(() => {
      component = new TestComponent();
      this.propsMock = {
        shortcuts: true
      };
    });

    it('should initialize shortcuts when we toggle shortcuts first time', () => {
      component.toggleShortcuts(this.propsMock);

      component.shortcutsScope.should.equal(component.scope);
    });

    it('should not initialize shortcuts if we do not have getShortctusProps', () => {
      sandbox.spy(shortcuts, 'pushScope');
      component.getShortcutsProps = null;

      component.setShortcutsEnabled(true);

      shortcuts.pushScope.should.not.have.been.called;
    });

    it('should bind map only once', () => {
      sandbox.spy(shortcuts, 'bindMap');

      component.setShortcutsEnabled(true);
      component.setShortcutsEnabled(false);
      component.setShortcutsEnabled(true);

      shortcuts.bindMap.should.have.been.calledOnce;
    });

    it('should enable shortcuts', () => {
      component.setShortcutsEnabled(true);

      component.shortcutsEnabled().should.equal(true);
    });

    it('should disable shortcuts', () => {
      component.setShortcutsEnabled(true);
      component.setShortcutsEnabled(false);

      component.shortcutsEnabled().should.equal(false);
    });

    it('should pass shortcuts options when we toggle shortcuts first time', () => {
      component.toggleShortcuts(this.propsMock);

      getShortcutsScopeFor(component.scope).
        options.
        should.
        equal(component.getShortcutsProps().options);
    });


    it('should pass shortcuts options when we toggle shortcuts after disabling', () => {
      const shortcutsOptions = component.getShortcutsProps().options;
      shortcutsOptions.modal = true;

      component.setShortcutsEnabled(true);
      component.setShortcutsEnabled(false);
      component.setShortcutsEnabled(true);

      getShortcutsScopeFor(component.scope).
        options.
        should.
        equal(shortcutsOptions);
    });
  });
});

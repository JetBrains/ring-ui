/* eslint-disable func-names */

import React from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';
import guid from 'mout/random/guid';

import shortcuts from '../shortcuts/core';

import RingComponentWithShortcuts from './ring-component_with-shortcuts';

import simulateCombo from 'simulate-combo';

describe('Ring Component With Shortcuts', () => {
  //const component;
  const noop = sinon.spy();
  //const noop2;
  const key = 'a';
  //const scope2 = 'scope2 scope2 scope2';
  const keyMap = {};
  keyMap[key] = noop;

  function trigger() {
    simulateCombo(key);
  }

  beforeEach(function () {
    const stub = this.stub = this.sinon.stub();
    shortcuts.reset();

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

    this.TestComponent = TestComponent;
  });


  describe('test as react component', () => {
    beforeEach(function () {
      this.component = renderIntoDocument(React.createElement(this.TestComponent, {
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
      shortcuts.getScope().
        should.
        deep.
        equal([shortcuts.wrapScope(this.component.scope)]);
      this.component.shortcutsScope.should.equal(this.component.scope);
    });

    it('should lazy activate shortcuts', function () {
      this.component.rerender({
        shortcuts: true
      });

      shortcuts.getScope().
        should.
        deep.
        equal([shortcuts.wrapScope(this.component.scope)]);
      this.component.shortcutsScope.should.equal(this.component.scope);
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


  describe('toggleShortcuts', () => {

    function getShortctusScopeFor(scope) {
      return shortcuts.getScope().
        filter(s => s.scopeId === scope) [0];
    }


    beforeEach(function () {
      this.component = new this.TestComponent();
      this.propsMock = {
        shortcuts: true
      };
    });

    it('should initialize shortcuts when we toggle shortcuts first time', function () {
      this.component.toggleShortcuts(this.propsMock);

      this.component.shortcutsScope.should.equal(this.component.scope);
    });

    it('should not initialize shortcuts if we do not have getShortctusProps', function () {
      this.sinon.spy(shortcuts, 'pushScope');
      this.component.getShortcutsProps = null;

      this.component.setShortcutsEnabled(true);

      shortcuts.pushScope.should.not.have.been.called;
    });

    it('should bind map only once', function () {
      this.sinon.spy(shortcuts, 'bindMap');

      this.component.setShortcutsEnabled(true);
      this.component.setShortcutsEnabled(false);
      this.component.setShortcutsEnabled(true);

      shortcuts.bindMap.should.have.been.calledOnce;
    });

    it('should enable shortcuts', function () {
      this.component.setShortcutsEnabled(true);

      this.component.shortcutsEnabled().should.equal(true);
    });

    it('should disable shortcuts', function () {
      this.component.setShortcutsEnabled(true);
      this.component.setShortcutsEnabled(false);

      this.component.shortcutsEnabled().should.equal(false);
    });

    it('should pass shortcuts options when we toggle shortcuts first time', function () {
      this.component.toggleShortcuts(this.propsMock);

      getShortctusScopeFor(this.component.scope).
        options.
        should.
        equal(this.component.getShortcutsProps().options);
    });


    it('should pass shortcuts options when we toggle shortcuts after disabling', function () {
      const shortcutsOptions = this.component.getShortcutsProps().options;
      shortcutsOptions.modal = true;

      this.component.setShortcutsEnabled(true);
      this.component.setShortcutsEnabled(false);
      this.component.setShortcutsEnabled(true);

      getShortctusScopeFor(this.component.scope).
        options.
        should.
        equal(shortcutsOptions);
    });
  });
});

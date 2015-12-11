/**
 * @fileoverview Tests of alerts stack component.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 */

import Alerts from './alerts';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

function noop() {}

describe('Alerts', function () {
  /** @type {Alerts} */
  let component;

  beforeEach(function () {
    component = TestUtils.renderIntoDocument(React.createElement(Alerts, null));
  });

  it('should render alerts component', function () {
    component.should.be.defined;
    component.node.should.be.an.instanceof(HTMLElement);
  });

  describe('adding alerts', function () {
    it('should add alert', function () {
      component._addElement('Child element.', Alerts.Type.MESSAGE, noop);

      return component.animationPromise.then(function () {
        return component.state.childElements.should.have.length(1);
      });
    });

    it('should add alert with React component child', function () {
      component._addElement(React.DOM.a(null, React.DOM.b(null, 'Composite element')), Alerts.Type.MESSAGE, noop);

      return component.animationPromise.then(function () {
        return component.state.childElements.should.have.length(1);
      });
    });


    it('should return deferred object', function () {
      const added = component.add('Child element');
      added.should.be.instanceof(Promise);
    });

    it('should render alerts in a reversed order. Last added alerts goes first.', function () {
      const LAST_TEXT = 'Last component';

      component._addElement('First', Alerts.Type.MESSAGE, noop);
      component._addElement(LAST_TEXT, Alerts.Type.MESSAGE, noop);

      const domElement = component.node;
      const children = domElement.querySelectorAll('.ring-alert');

      children[0].textContent.should.equal(LAST_TEXT);
    });
  });

  describe('removing alerts', function () {
    it('should remove alert', function () {
      component._addElement('Child element.', Alerts.Type.MESSAGE, noop);
      component.remove(component.state.childElements[0]);

      component.state.childElements.should.have.length(0);
    });

    it('should remove alert by clicking on close button', function () {
      component._addElement('Child element.', Alerts.Type.MESSAGE, noop);
      const clickElement = component.node.querySelector('.ring-alert__close');
      TestUtils.Simulate.click(clickElement, {});

      component.state.childElements.should.have.length(0);
    });

    it('should not remove alert by calling close() method of alert component', function () {
      component._addElement('Child element.', Alerts.Type.MESSAGE, noop);
      const addedComponent = component.refs['alert-0'];
      expect(addedComponent.close).to.throw(Error);
    });

    it('should remove alert after timeout', function () {
      this.sinon.useFakeTimers();

      const TIMEOUT = 100;
      component._addElement('Child element.', Alerts.Type.MESSAGE, noop, TIMEOUT);

      // Before timeout component exists.
      component.state.childElements.should.exist;

      this.sinon.clock.tick(200);

      should.not.exist(component.state.childElements[0]);
    });
  });
});

/**
 * @fileoverview Tests of alerts stack component.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 */

import Alerts from './alerts';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

describe('Alerts', () => {
  /** @type {Alerts} */
  let component;

  beforeEach(() => {
    component = TestUtils.renderIntoDocument(React.createElement(Alerts, null));
    window.TransitionEvent = undefined;  // disable waiting for animation (which would never occur)
  });

  it('should render alerts component', () => {
    component.should.be.defined;
    component.node.should.be.an.instanceof(HTMLElement);
  });

  describe('adding alerts', () => {
    it('should add alert', () => {
      component.add('Child element.', Alerts.Type.MESSAGE);

      return component.animationPromise.then(() => component.state.childElements.should.have.length(1));
    });

    it('should add alert with React component child', () => {
      component.add(React.DOM.a(null, React.DOM.b(null, 'Composite element')), Alerts.Type.MESSAGE);

      return component.animationPromise.then(() => component.state.childElements.should.have.length(1));
    });

    it('should combine alerts with same text and type', () => {
      component.add('Child element.', Alerts.Type.MESSAGE);
      component.add('Child element.', Alerts.Type.MESSAGE);
      component.add('Child element.', Alerts.Type.MESSAGE);

      return component.animationPromise.then(() => component.state.childElements.should.have.length(1));
    });

    it('should have proper count in combined alert', () => {
      component.add('Child element.', Alerts.Type.MESSAGE);
      component.add('Child element.', Alerts.Type.MESSAGE);
      component.add('Child element.', Alerts.Type.MESSAGE);

      return component.animationPromise.then(() => component.state.childElements[0].count.should.equal(3));
    });

    it('should combine alerts with same text and type with last alert only', () => {
      component.add('Child element.', Alerts.Type.MESSAGE);
      component.add('Child element.', Alerts.Type.MESSAGE);

      component.add('Child element.', Alerts.Type.ERROR);

      component.add('Child element.', Alerts.Type.MESSAGE);
      component.add('Child element.', Alerts.Type.MESSAGE);
      component.add('Child element.', Alerts.Type.MESSAGE);

      return component.animationPromise.then(() => {
        component.state.childElements.should.have.length(3);
        component.state.childElements[0].count.should.equal(3); // latest
        component.state.childElements[2].count.should.equal(2); // oldest
      });
    });

    it('should return deferred object', () => {
      const added = component.add('Child element');
      added.should.be.instanceof(Promise);
    });

    it('should render alerts in a reversed order. Last added alerts goes first.', () => {
      const LAST_TEXT = 'Last component';

      component.add('First', Alerts.Type.MESSAGE);
      component.add(LAST_TEXT, Alerts.Type.MESSAGE);

      return component.animationPromise.then(() => {
        const domElement = component.node;
        const children = domElement.querySelectorAll('.ring-alert');

        return children[0].textContent.should.equal(LAST_TEXT);
      });
    });
  });

  describe('removing alerts', () => {
    it('should remove alert', () => {
      component.add('Child element.', Alerts.Type.MESSAGE);
      component.remove(component.state.childElements[0]);

      component.state.childElements.should.have.length(0);
    });

    it('should remove alert by clicking on close button', () => {
      component.add('Child element.', Alerts.Type.MESSAGE);

      return component.animationPromise.then(() => {
        const clickElement = component.node.querySelector('.ring-alert__close');
        TestUtils.Simulate.click(clickElement, {});

        return component.state.childElements.should.have.length(0);
      });
    });

    it('should not remove alert by calling close() method of alert component', () => {
      component.add('Child element.', Alerts.Type.MESSAGE);

      return component.animationPromise.then(() => {
        const addedComponent = component.refs['alert-0'];
        return expect(addedComponent.close).to.throw(Error);
      });
    });

    it('should remove alert after timeout', function () {
      this.sinon.useFakeTimers();

      const TIMEOUT = 100;
      component.add('Child element.', Alerts.Type.MESSAGE, TIMEOUT);

      // Before timeout component exists.
      component.state.childElements.should.exist;

      this.sinon.clock.tick(200);

      should.not.exist(component.state.childElements[0]);
    });
  });
});

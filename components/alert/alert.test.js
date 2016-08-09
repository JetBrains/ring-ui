/**
 * @fileoverview Alert component tests
 * @author igor.alexeenko@jetbrains.com
 */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Alert from './alert';

describe('Alert', () => {
  it('should render', () => {
    const alertComponent = TestUtils.renderIntoDocument(
        React.createElement(Alert, {caption: 'Test element'}));
    alertComponent.should.be.defined;
  });

  describe('rendering', () => {
    describe('rendering modes', () => {
      it('should render a message', () => {
        const alertComponent = TestUtils.renderIntoDocument(
            React.createElement(Alert, {caption: 'Test element', type: Alert.Type.MESSAGE}));

        alertComponent.node.should.have.class('ring-alert_message');
      });

      it('should render an error', () => {
        const alertComponent = TestUtils.renderIntoDocument(
            React.createElement(Alert, {caption: 'Test element', type: Alert.Type.ERROR}));

        alertComponent.node.should.have.class('ring-alert_error');
      });

      it('should render a warning', () => {
        const alertComponent = TestUtils.renderIntoDocument(
            React.createElement(Alert, {caption: 'Test element', type: Alert.Type.WARNING}));

        alertComponent.node.should.have.class('ring-alert_warning');
      });

      it('should render a success message', () => {
        const alertComponent = TestUtils.renderIntoDocument(
            React.createElement(Alert, {caption: 'Test element', type: Alert.Type.SUCCESS}));

        alertComponent.node.should.have.class('ring-alert_success');
      });

      it('should render a message if no type is specified', () => {
        const alertComponent = TestUtils.renderIntoDocument(
            React.createElement(Alert, {caption: 'Test element'}));

        alertComponent.node.should.have.class('ring-alert_message');
      });
    });

    describe('closeable alerts', () => {
      it('should be closeable if it is defined in options', () => {
        const alertComponent = TestUtils.renderIntoDocument(
            React.createElement(Alert, {caption: 'Test element', closeable: true}));

        const alertElement = alertComponent.node;
        const closeElement = alertElement.querySelector('.ring-alert__close');

        closeElement.should.not.be.null;
      });

      it('should be closed on click', () => {
        const alertComponent = TestUtils.renderIntoDocument(
            React.createElement(Alert, {caption: 'Test element', closeable: true}));

        const alertElement = alertComponent.node;
        const closeElement = alertElement.querySelector('.ring-alert__close');

        TestUtils.Simulate.click(closeElement);

        should.not.exist(alertElement.node);
      });
    });
  });
});

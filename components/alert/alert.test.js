/**
 * @fileoverview Alert component tests
 * @author igor.alexeenko@jetbrains.com
 */

var Alert = require('./alert');
var React = require('react');
var TestUtils = require('react-addons-test-utils');

describe('Alert', function() {
  var $ = require('jquery');

  it('should render', function() {
    var alertComponent = TestUtils.renderIntoDocument(
        React.createElement(Alert, { 'caption': 'Test element' }));
    alertComponent.should.be.defined;
  });

  describe('rendering', function() {
    describe('rendering modes', function() {
      it('should render a message', function() {
        var alertComponent = TestUtils.renderIntoDocument(
            React.createElement(Alert, { 'caption': 'Test element', 'type': Alert.Type.MESSAGE }));

        $(alertComponent.node).should.have.class('ring-alert_message');
      });

      it('should render an error', function() {
        var alertComponent = TestUtils.renderIntoDocument(
            React.createElement(Alert, { 'caption': 'Test element', 'type': Alert.Type.ERROR }));

        $(alertComponent.node).should.have.class('ring-alert_error');
      });

      it('should render a warning', function() {
        var alertComponent = TestUtils.renderIntoDocument(
            React.createElement(Alert, { 'caption': 'Test element', 'type': Alert.Type.WARNING }));

        $(alertComponent.node).should.have.class('ring-alert_warning');
      });

      it('should render a success message', function() {
        var alertComponent = TestUtils.renderIntoDocument(
            React.createElement(Alert, { 'caption': 'Test element', 'type': Alert.Type.SUCCESS }));

        $(alertComponent.node).should.have.class('ring-alert_success');
      });

      it('should render a message if type is not passed', function() {
        var alertComponent = TestUtils.renderIntoDocument(
            React.createElement(Alert, { 'caption': 'Test element' }));

        $(alertComponent.node).should.have.class('ring-alert_message');
      });
    });

    describe('closeable alerts', function() {
      it('should be closeable if it is defined in options', function() {
        var alertComponent = TestUtils.renderIntoDocument(
            React.createElement(Alert, { caption: 'Test element', closeable: true }));

        var alertElement = alertComponent.node;
        var closeElement = alertElement.querySelector('.ring-alert__close');

        closeElement.should.not.be.null;
      });

      it('should be closed on click', function() {
        var alertComponent = TestUtils.renderIntoDocument(
            React.createElement(Alert, { caption: 'Test element', closeable: true }));

        var alertElement = alertComponent.node;
        var closeElement = alertElement.querySelector('.ring-alert__close');

        TestUtils.Simulate.click(closeElement);

        should.not.exist(alertElement.node);
      });
    });
  });
});

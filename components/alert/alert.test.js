/**
 * @fileoverview Alert component tests
 * @author igor.alexeenko@jetbrains.com
 */

var Alert = require('./alert');
var React = require('react/addons');

describe('Alert', function() {
  var $ = require('jquery');

  it('should render', function() {
    var alertComponent = React.addons.TestUtils.renderIntoDocument(
        new Alert({ 'caption': 'Test element' }));
    alertComponent.should.be.defined;
  });

  describe('rendering', function() {
    describe('rendering modes', function() {
      it('should render a message', function() {
        var alertComponent = React.addons.TestUtils.renderIntoDocument(
            new Alert({ 'caption': 'Test element', 'type': Alert.Type.MESSAGE }));

        var alertElement = alertComponent.getDOMNode();
        $(alertElement).should.have.class('ring-alert_message');
      });

      it('should render an error', function() {
        var alertComponent = React.addons.TestUtils.renderIntoDocument(
            new Alert({ 'caption': 'Test element', 'type': Alert.Type.ERROR }));

        var alertElement = alertComponent.getDOMNode();
        $(alertElement).should.have.class('ring-alert_error');
      });

      it('should render a warning', function() {
        var alertComponent = React.addons.TestUtils.renderIntoDocument(
            new Alert({ 'caption': 'Test element', 'type': Alert.Type.WARNING }));

        var alertElement = alertComponent.getDOMNode();
        $(alertElement).should.have.class('ring-alert_warning');
      });

      it('should render a success message', function() {
        var alertComponent = React.addons.TestUtils.renderIntoDocument(
            new Alert({ 'caption': 'Test element', 'type': Alert.Type.SUCCESS }));

        var alertElement = alertComponent.getDOMNode();
        $(alertElement).should.have.class('ring-alert_success');
      });

      it('should render a message if type is not passed', function() {
        var alertComponent = React.addons.TestUtils.renderIntoDocument(
            new Alert({ 'caption': 'Test element' }));

        var alertElement = alertComponent.getDOMNode();
        $(alertElement).should.have.class('ring-alert_message');
      });
    });

    describe('closeable alerts', function() {
      it('should be closeable if it is defined in options', function() {
        var alertComponent = React.addons.TestUtils.renderIntoDocument(
            new Alert({ caption: 'Test element', closeable: true }));

        var alertElement = alertComponent.getDOMNode();
        var closeElement = alertElement.querySelector('.ring-alert__close');

        closeElement.should.not.be.null;
      });

      it('should be closed on click', function() {
        var alertComponent = React.addons.TestUtils.renderIntoDocument(
            new Alert({ caption: 'Test element', closeable: true }));

        var alertElement = alertComponent.getDOMNode();
        var closeElement = alertElement.querySelector('.ring-alert__close');

        React.addons.TestUtils.Simulate.click(closeElement);
        alertComponent.isMounted().should.be.false;
      });
    });
  });
});

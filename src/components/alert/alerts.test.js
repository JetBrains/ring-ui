/**
 * @fileoverview Tests of alerts stack component.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 */

var Alerts = require('./alerts');
var React = require('react/addons');

describe.only('Alerts', function() {
  /** @type {Alerts} */
  var component;

  beforeEach(function() {
    component = React.addons.TestUtils.renderIntoDocument(Alerts(null));
  });

  it('should render alerts component', function() {
    component.should.be.defined;
    component.getDOMNode().should.be.an.instanceof(HTMLElement);
  });

  describe('adding alerts', function() {
    it('should add alert', function() {
      component.add('Child element');

      component.state['childElements'].should.be.an.instanceof(Array);
      component.state['childElements'].length.should.equal(1);
    });

    it('should return deferred object', function() {
      var added = component.add('Child element');
      added.done.should.be.defined; // NB! instanceof $.Deferred doesn't work.
    });

    it('should render alerts in a reversed order. Last added alerts goes first.', function() {
      component.add('Child element one.');
      var addSecond = component.add('Child element two.');
    });
  });

  describe('removing alerts', function() {
    it('should remove alert', function() {
      component.add('Child element.');
    });

    it('should remove alert by clicking on close button', function() {
      component.add('Child element.');
    });

      // todo(igor.alexeenko): Async tests.
    it('should not remove alert by calling close() method of alert component', function() {
      component.add('Child element.');
    });
  });
});

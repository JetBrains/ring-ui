describe('popup-menu', function () {
  var $ = require('jquery');
  var React = require('react/addons');
  var PopupMenu = require('./popup-menu');
  var popup;

  beforeEach(function() {
    popup = React.addons.TestUtils.renderIntoDocument(new PopupMenu());
  });

  it('should create component', function () {
    popup.should.exist;
  });

  it('should be empty by default', function () {
    popup.getDOMNode().tagName.toLowerCase().should.equal('div');
    popup.getDOMNode().firstChild.hasChildNodes().should.equal(false);
  });

  it('should re-render content on change state', function () {
    popup.setProps({'data': [
      {'label': 'Hello!'}
    ]});

    popup.should.exist;
    popup.getDOMNode().tagName.toLowerCase().should.equal('div');
    $(popup.getDOMNode().firstChild.firstChild).should.have.class('ring-list__item');
  });

  it('should handle click', function () {
    var clicked = sinon.stub();

    popup.setProps({'data': [
      {'label': 'Hello!', 'onClick': clicked}
    ]});

    $(popup.getDOMNode().firstChild.firstChild).should.have.class('ring-list__item');
    React.addons.TestUtils.Simulate.click(popup.getDOMNode().firstChild.firstChild);
    clicked.should.have.been.called;
  });

  it('should render something', function () {
    popup.setProps({'data': [
      {}
    ]});

    $(popup.getDOMNode().firstChild.firstChild).should.have.class('ring-list__item_action');
    popup.getDOMNode().firstChild.firstChild.innerHTML.should.equal('');
  });

});

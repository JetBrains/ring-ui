describe('footer', function () {
  var $ = require('jquery');
  var React = require('react/addons');
  var Footer = require('./footer');
  var footer;

  beforeEach(function() {
    footer = React.addons.TestUtils.renderIntoDocument(new Footer());
  });

  it('should create component', function () {
    footer.should.exist;
  });

  it('should be empty by default', function () {
    footer.getDOMNode().tagName.toLowerCase().should.equal('div');
    $(footer.getDOMNode()).should.be.empty;
  });

  describe('should render items', function() {

    it('should add given class', function () {
      footer.setProps({'className': 'myClass'});

      $(footer.getDOMNode()).should.have.class('myClass');
    });

    it('should render left column if defined', function () {
      footer.setProps({'left': [
        {'label': 'Hello!'}
      ]});

      $(footer.getDOMNode()).should.have.class('ring-popup__item_action');
      footer.getDOMNode().firstChild.firstChild.innerHTML.should.equal('Hello!');
    });

  });
});

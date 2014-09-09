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

    it('add left column one line', function () {
      footer.setProps({'left': ['One Line']});

      $(footer.getDOMNode()).should.contain('One Line');
      $(footer.getDOMNode()).find('li').should.not.be.empty;
      $(footer.getDOMNode()).find('li').length.should.equal(1);
    });

    it('add left column two lines', function () {
      footer.setProps({'left': ['One Line','Second Line']});

      $(footer.getDOMNode()).find('li').should.not.be.empty;
      $(footer.getDOMNode()).find('li').length.should.equal(2);
    });

    it('add three columns two lines', function () {
      footer.setProps({
        'left': ['One Line','Second Line'],
        'center': ['One Line','Second Line'],
        'right': ['One Line','Second Line']
      });
      function assertLines(lines, count) {
        lines.should.not.be.empty;
        lines.length.should.equal(count);
      }

      var root = $(footer.getDOMNode());
      var ul = root.find('ul');
      ul.length.should.equal(3);

      assertLines(ul.eq(0).find('li'), 2);
      assertLines(ul.eq(1).find('li'), 2);
      assertLines(ul.eq(2).find('li'), 2);
    });

  });
});

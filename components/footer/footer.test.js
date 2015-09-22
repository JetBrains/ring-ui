describe('Footer', function () {
  var $ = require('jquery');
  var React = require('react');
  var TestUtils = require('react-addons-test-utils');
  var Footer = require('./footer');
  var footer;

  beforeEach(function () {
    footer = TestUtils.renderIntoDocument(React.createElement(Footer));
  });

  it('should create component', function () {
    footer.should.exist;
  });

  it('should be empty by default', function () {
    footer.node.tagName.toLowerCase().should.equal('div');
    footer.node.innerHTML.should.be.empty;
  });

  describe('should render items', function () {

    it('should add given class', function () {
      footer.rerender({'className': 'myClass'});

      $(footer.node).should.have.class('myClass');
    });

    it('add left column one line', function () {
      footer.rerender({'left': ['One Line']});
      footer.node.textContent.should.equal('One Line');
      $(footer.node).find('li').should.not.be.empty;
      $(footer.node).find('li').length.should.equal(1);
    });

    it('add left column two lines', function () {
      footer.rerender({'left': ['One Line', 'Second Line']});

      $(footer.node).find('li').should.not.be.empty;
      $(footer.node).find('li').length.should.equal(2);
    });

    it('add three columns two lines', function () {
      footer.rerender({
        'left': ['One Line', 'Second Line'],
        'center': ['One Line', 'Second Line'],
        'right': ['One Line', 'Second Line']
      });
      function assertLines(lines, count) {
        lines.should.not.be.empty;
        lines.length.should.equal(count);
      }

      var root = $(footer.node);
      var ul = root.find('ul');
      ul.length.should.equal(3);

      assertLines(ul.eq(0).find('li'), 2);
      assertLines(ul.eq(1).find('li'), 2);
      assertLines(ul.eq(2).find('li'), 2);
    });

  });

  it('should render copyright', function () {
    footer.rerender({
      'left': [
        {'copyright': 2010, 'label': ' JetBrains'}
      ]
    });

    $(footer.node).find('li').text().should.contain('© 2010—' + (new Date()).getFullYear() + ' JetBrains');
  });

  it('should render link', function () {
    footer.rerender({
      'left': [
        {'url': 'http://jetbrains.com', 'label': 'JetBrains', 'title': 'JetBrains Official Site'}
      ]
    });

    var link = $(footer.node).find('a');
    link.should.not.be.empty;
    link.text().should.equal('JetBrains');
    link.prop('href').should.equal('http://jetbrains.com/');
    link.prop('title').should.equal('JetBrains Official Site');
  });
});

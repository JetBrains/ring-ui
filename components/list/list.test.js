describe('List', function () {
  var $ = require('jquery');
  var React = require('react/addons');
  var List = require('./list');
  var list;

  var getFirstListItem = function () {
    return list.refs.inner.getDOMNode().firstChild;
  };

  beforeEach(function() {
    list = React.addons.TestUtils.renderIntoDocument(new List());
  });

  it('should be empty by default', function () {
    list.refs.inner.getDOMNode().tagName.toLowerCase().should.equal('div');
    list.refs.inner.getDOMNode().hasChildNodes().should.equal(false);
  });

  describe('should render items', function() {
    it('should render for empty element', function () {
      list.setProps({'data': [
        {}
      ]});

      $(getFirstListItem()).should.have.class('ring-list__item_action');
      getFirstListItem().innerHTML.should.equal('');
    });

    it('should render list item if type is not definded', function () {
      list.setProps({'data': [
        {'label': 'Hello!'}
      ]});

      $(getFirstListItem()).should.have.class('ring-list__item');
      $(getFirstListItem()).should.have.class('ring-list__item_action');
      // React creates unexpected additional span
      getFirstListItem().firstChild.innerHTML.should.equal('Hello!');
    });

    it('should render a if href defined', function () {
      list.setProps({'data': [
        {'label': 'Hello!', 'href': 'http://www.jetbrains.com'}
      ]});

      $(getFirstListItem()).should.have.class('ring-link');
      getFirstListItem().innerHTML.should.equal('Hello!');
      getFirstListItem().tagName.toLowerCase().should.equal('a');
      getFirstListItem().getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render a if url defined', function () {
      list.setProps({'data': [
        {'label': 'Hello!', 'url': 'http://www.jetbrains.com'}
      ]});

      $(getFirstListItem()).should.have.class('ring-link');
      getFirstListItem().innerHTML.should.equal('Hello!');
      getFirstListItem().tagName.toLowerCase().should.equal('a');
      getFirstListItem().getAttribute('href').should.equal('http://www.jetbrains.com');
    });

    it('should render separator', function () {
      list.setProps({'data': [
        {'type': List.ListProps.Type.SEPARATOR}
      ]});

      $(getFirstListItem()).should.have.class('ring-list__separator');
    });

    it('should render span if link without href', function () {
      list.setProps({'data': [
        {'label': 'Hello!', 'type': List.ListProps.Type.LINK}
      ]});

      $(getFirstListItem()).should.have.class('ring-link');
      getFirstListItem().innerHTML.should.equal('Hello!');
      getFirstListItem().tagName.toLowerCase().should.equal('span');
    });

    it('should not render icon if not provided', function () {
      list.setProps({'data': [
        {'label': 'Hello!', 'type': List.ListProps.Type.ITEM}
      ]});
      $(getFirstListItem()).should.not.have.descendants('.ring-list__icon');
    });

    it('should render icon if provided', function () {
      list.setProps({'data': [
        {'label': 'Hello!', icon: 'http://some.url/', 'type': List.ListProps.Type.ITEM}
      ]});
      var icon = getFirstListItem().querySelector('.ring-list__icon');
      expect(icon.style.backgroundImage).to.contain('http://some.url');
    });

    it('should throw error on unknown type', function () {

      expect(function () {
        list.setProps({'data': [
          {'label': 'Hello!', 'type': 'none'}
        ]});

        $(getFirstListItem()).should.have.class('ring-link');
        getFirstListItem().innerHTML.should.equal('Hello!');
        getFirstListItem().tagName.toLowerCase().should.equal('span');
      }).to.throw(Error, 'Unknown menu element type: none');
    });

    it('should handle click', function () {
      var clicked = sinon.stub();

      list.setProps({'data': [
        {'label': 'Hello!', 'onClick': clicked}
      ]});

      React.addons.TestUtils.Simulate.click(getFirstListItem());
      clicked.should.have.been.called;
    });
  });
});

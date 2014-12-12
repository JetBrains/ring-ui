describe('QueryAssist', function() {
  var React = require('react/addons');
  var QueryAssist = require('./query-assist');

  beforeEach(function() {
    this.queryAssist = React.addons.TestUtils.renderIntoDocument(new QueryAssist({
      query: 'test',
      dataSource: function() {
        return {};
      }
    }));
  });

  it('should create component', function() {
    this.queryAssist.should.exist;
  });

  it('should set state on init', function() {
    this.queryAssist.state.query.should.equal('test');
    this.queryAssist.state.caret.should.equal(4);
  });

  it('should set state on update', function() {
    this.queryAssist.setProps({
      query: 'update',
      caret: 1
    });

    this.queryAssist.state.query.should.equal('update');
    this.queryAssist.state.caret.should.equal(1);
  });

  it('should not set undefined props on update', function() {
    this.queryAssist.setProps({
      query: 'update',
      caret: undefined
    });

    this.queryAssist.state.query.should.equal('update');
    this.queryAssist.state.caret.should.equal(4);
  });
});

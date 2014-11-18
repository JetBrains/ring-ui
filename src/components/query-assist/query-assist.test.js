describe('query-assist', function() {
  var React = require('react/addons');
  var QueryAssist = require('./query-assist');

  beforeEach(function() {
    this.queryAssist = React.addons.TestUtils.renderIntoDocument(new QueryAssist());
  });

  it('should create component', function() {
    this.queryAssist.should.exist;
  });

  it('should save caret position after generating state on params that does not contain caret property', function() {
    this.queryAssist.setState({
      query: 'Source query',
      caret: 1
    });
    this.queryAssist.state.caret
      .should.equal(1);

    this.queryAssist.setState(this.queryAssist.generateState({
      query: 'Updated query'
    }));

    this.queryAssist.state.caret
      .should.equal(1);
  });
});

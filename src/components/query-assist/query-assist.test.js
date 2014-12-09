describe('query-assist', function() {
  var React = require('react/addons');
  var QueryAssist = require('./query-assist');

  beforeEach(function() {
    this.queryAssist = React.addons.TestUtils.renderIntoDocument(new QueryAssist());
  });

  it('should create component', function() {
    this.queryAssist.should.exist;
  });
});

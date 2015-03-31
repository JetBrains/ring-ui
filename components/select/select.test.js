var Select = require('./select');
var List = require('list/list');
var React = require('react/addons');
var renderIntoDocument = require('render-into-document');

describe('Select(react)', function () {
  var testData = [
    {key: 1, label: 'first1'},
    {key: 2, label: 'test2'},
    {key: 3, label: 'test3'},
    {key: 4, label: 'four4'}
  ];

  beforeEach(function () {
    this.select = renderIntoDocument(new Select({
      data: testData,
      selected: testData[0],
      filter: true
    }));
  });

  it('Should initialize', function () {
    expect(this.select).to.be.defined;
  });

  it('Should save selected item in state', function () {
    expect(this.select.state.selected).to.equal(this.select.props.selected);
  });

  it('Should provide select types', function () {
    expect(Select.Type).to.be.defined;
    expect(Select.Type.BUTTON).to.be.defined;
    expect(Select.Type.INPUT).to.be.defined;
    expect(Select.Type.CUSTOM).to.be.defined;
  });

  it('Should compute selected index', function () {
    var selectedIndex = this.select._getSelectedIndex(testData[2], testData);
    selectedIndex.should.equal(2);
  });

  describe('getListItems', function () {
    it('Should filter items by label', function () {
      var filtered = this.select.getListItems('test3');
      filtered.length.should.equal(1);
      filtered[0].label.should.equal('test3');
    });

    it('Should filter items by part of label', function () {
      var filtered = this.select.getListItems('test');
      filtered.length.should.equal(2);
    });

    it('Should not filter separators', function () {
      var separators = [{
        type: List.ListProps.Type.SEPARATOR,
        key: 1,
        description: 'test'
      }];
      this.select.setProps({data: separators});

      var filtered = this.select.getListItems('foo');
      filtered.should.deep.equal(separators);
    });

    it('Should use custom filter.fn if provided', function () {
      var filterStub = this.sinon.stub().returns(true);

      this.select.setProps({
        filter: {fn: filterStub}
      });

      var filtered = this.select.getListItems('test3');

      filtered.length.should.equal(testData.length);
      filterStub.should.have.callCount(4);
    });

    it('Should write filter query on add button if enabled', function () {
      this.select.setProps({
        add: {
          prefix: 'Add some'
        }
      });

      this.select.getListItems('foo');

      this.select._addButton.label.should.equal('foo');
    });
  });

  describe('filterValue', function () {
    it('Should return empty string if not input mode and filter is disabled', function () {
      this.select.setProps({filter: false, type: Select.Type.BUTTON});

      this.select.filterValue().should.equal('');
    });

    it('Should set vallue to popup input if passed', function () {
      this.select.filterValue('test');
      this.select._popup.refs.filter.getDOMNode().value.should.equal('test');
    });

    it('Should set target input in input mode', function () {
      this.select.setProps({filter: false, type: Select.Type.INPUT});

      this.select.filterValue('test');
      this.select.refs.filter.getDOMNode().value.should.equal('test');
    });
  });

  describe('Multiple', function () {
    var selectedArray;
    beforeEach(function () {
      selectedArray = testData.slice(0, 2);

      this.select = renderIntoDocument(new Select({
        data: testData,
        selected: selectedArray,
        filter: true,
        multiple: true
      }));
    });

    it('Should fill _multipleMap on initialization', function () {
      this.select._multipleMap['1'].should.be.true;
    });

    it('Should fill _multipleMap on _rebuildMultipleMap', function () {
      this.select._rebuildMultipleMap(testData.slice(1, 2));
      this.select._multipleMap['2'].should.be.true;
    });
  });
});

var Select = require('./select');
var List = require('list/list');
var renderIntoDocument = require('render-into-document');
var $ = require('jquery');

describe.only('Select(react)', function () {
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

  it('Should use selectedLabel for select button title if provided', function () {
    this.select.setProps({selected: {
      key: 1, label: 'test1', selectedLabel: 'testLabel'
    }});
    var selectedLabel = this.select._getSelectedString();
    selectedLabel.should.equal('testLabel');
  });

  it('Should use label for select button title', function () {
    var selectedLabel = this.select._getSelectedString();
    selectedLabel.should.equal('first1');
  });

  it('Should clear selected on clearing', function () {
    this.select.clear();
    expect(this.select.state.selected).to.be.null;
  });

  describe('DOM', function () {
    it('Should place select button inside container', function () {
      $(this.select.getDOMNode()).should.have.class('ring-select');
    });

    it('Should disable select button if needed', function () {
      this.select.setProps({
        disabled: true
      });
      $(this.select.getDOMNode()).should.have.class('ring-select_disabled');
    });

    it('Should place input inside in INPUT mode', function () {
      this.select.setProps({type: Select.Type.INPUT});
      $(this.select.getDOMNode()).should.have.descendants('input');
    });

    it('Should place icons inside', function () {
      $(this.select.getDOMNode()).should.have.descendants('.ring-select__icons');
    });

    it('Should place icons inside in INPUT mode', function () {
      this.select.setProps({type: Select.Type.INPUT});
      $(this.select.getDOMNode()).should.have.descendants('.ring-select__icons');
    });
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

    it('Should construct label from selected array', function () {
      var selectedLabel = this.select._getSelectedString();
      selectedLabel.should.equal('first1, test2');
    });

    it('Should detect selection is empty according on not empty array', function () {
      this.select._selectionIsEmpty().should.be.false;
    });

    it('Should detect selection is empty according on empty array', function () {
      this.select.setProps({selected: []});
      this.select._selectionIsEmpty().should.be.true;
    });

    it('Should clear selected on clearing', function () {
      this.select.clear();
      this.select.state.selected.length.should.equal(0);
    });

    describe('On selecting', function () {
      it('Should add item to multiple map on selecting item', function () {
        this.select._listSelectHandler(testData[3]);
        this.select._multipleMap['4'].should.be.true;
      });

      it('Should add item to selected on selecting item', function () {
        var lengthBefore = selectedArray.length;
        this.select._listSelectHandler(testData[3]);
        this.select.state.selected.length.should.equal(lengthBefore + 1);
      });

      it('Should not close popup on selecting', function () {
        this.select._hidePopup = sinon.spy();
        this.select._listSelectHandler(testData[3]);
        this.select._hidePopup.should.not.been.called;
      });
    });

    describe('On deselecting', function () {
      it('Should remove item from selected on deselecting', function () {
        var lengthBefore = selectedArray.length;
        this.select._listSelectHandler(testData[0]);
        this.select.state.selected.length.should.equal(lengthBefore - 1);
      });

      it('Should call onDeselect on deselecting item', function () {
        this.select.setProps({
          onDeselect: this.sinon.spy()
        });
        this.select._listSelectHandler(testData[0]);
        this.select.props.onDeselect.should.been.calledWith(testData[0]);
      });
    });

  });

  describe('On selecting', function () {
    it('Should not react on selecting disabled element', function () {
      this.select.setState = sinon.spy();

      this.select._listSelectHandler({
        key: 1,
        label: 'test',
        disabled: true
      });

      this.select.setState.should.not.been.called;
    });

    it('Should not react on selecting separator', function () {
      this.select.setState = sinon.spy();

      this.select._listSelectHandler({
        key: 1,
        label: 'test',
        type: List.ListProps.Type.SEPARATOR
      });

      this.select.setState.should.not.been.called;
    });

    it('Should set selected on selecting', function () {
      this.select._listSelectHandler(testData[3]);
      this.select.state.selected.should.equal(testData[3]);
    });

    it('Should set call onSelect on selecting', function () {
      this.select.setProps({
        onSelect: this.sinon.spy()
      });
      this.select._listSelectHandler(testData[1]);
      this.select.props.onSelect.should.been.calledOnce;
    });

    it('Should set call onChange on selecting', function () {
      this.select.setProps({
        onChange: this.sinon.spy()
      });
      this.select._listSelectHandler(testData[1]);
      this.select.props.onChange.should.been.calledOnce;
    });

    it('Should hide popup on selecting', function () {
      this.select._hidePopup = sinon.spy();
      this.select._listSelectHandler(testData[1]);
      this.select._hidePopup.should.been.calledOnce;
    });
  });
});

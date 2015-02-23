require('angular/angular');
require('angular-mocks/angular-mocks');
require('./table-ng');
var TableSelection = require('./table-ng__selection');
var $ = require('jquery');

describe('TableNg', function () {

  var scope;
  var directiveController;
  var element;
  var $compile;
  var fakeData = {
    items: [],
    loadMore: function () {}
  };

  beforeEach(function () {
    //Restoring items before each test to prevent side effects
    fakeData.items = [
      {id: 1, name: 'test1'},
      {id: 2, name: 'test2'},
      {id: 3, name: 'test3'},
      {id: 4, name: 'test4'}
    ];
  });

  beforeEach(window.module('Ring.table'));

  /* global inject */
  beforeEach(inject(function ($rootScope, _$compile_) {
    scope = $rootScope.$new();
    $compile = _$compile_;

    scope.data = fakeData;

    element = $compile(
    '<rg-table items="data.items">' +
      '<rg-table-header></rg-table-header>' +
      '<rg-table-row row-item="item" ng-repeat="item in data.items">' +
        '<div class="ring-table__column">{{item.id}}</div>' +
      '</rg-table-row>' +
    '</rg-table>'
    )(scope);

    scope.$digest();
    directiveController = element.controller('rgTable');
  }));

  describe('DOM', function () {
    it('Should place table inside', function () {
      expect(element).to.have.descendants('table');
    });

    it('Should place all items inside table', function () {
      var $rows = $('.ring-table__row', element);
      expect($rows.length).to.equal(fakeData.items.length);
    });
  });


  describe('Selection', function () {
    var selection;
    var fakeEvent = {};

    beforeEach(function () {
      fakeEvent.emitEvent = sinon.spy();
      selection = new TableSelection(fakeData.items, fakeEvent.emitEvent.bind(fakeEvent));
    });

    it('Should receive items and store it inside instance', function () {
      expect(selection.items).to.equal(fakeData.items);
    });

    describe('Activation, deactivation, etc', function () {
      it('Should mark item as active on activateItem', function () {
        selection.activateItem(fakeData.items[1]);
        expect(selection.getActiveItem()).to.equal(fakeData.items[1]);
      });

      it('Should return active item from getActiveItem', function () {
        selection.activateItem(fakeData.items[2]);
        expect(fakeData.items[2].active).to.be.true;
      });

      it('Should clear other active item on activateItem', function () {
        selection.activateItem(fakeData.items[2]);
        expect(fakeData.items[2].active).to.be.true;
      });

      it('Should mark item as active on activateItem', function () {
        selection.activateItem(fakeData.items[2]);
        selection.activateItem(fakeData.items[3]);
        expect(fakeData.items[2].active).to.be.false;
        expect(fakeData.items[3].active).to.be.true;
      });

      it('Should move selection down on activateNextItem', function () {
        selection.activateItem(fakeData.items[2]);
        selection.activateNextItem();
        expect(fakeData.items[3].active).to.be.true;
      });

      it('Should move selection up on activatePreviousItem', function () {
        selection.activateItem(fakeData.items[2]);
        selection.activatePreviousItem();
        expect(fakeData.items[1].active).to.be.true;
      });

      it('Should deactivate active item if first is active and then moving up', function () {
        selection.activateItem(fakeData.items[0]);
        selection.activatePreviousItem();
        expect(selection.getActiveItem()).to.be.undefined;
      });

      it('Should trigger rgTable:activateItem event on activation', function () {
        selection.activateItem(fakeData.items[0]);
        expect(fakeEvent.emitEvent).to.have.been.calledWith('rgTable:activateItem', fakeData.items[0]);
      });

      it('Should trigger rgTable:activateItem with empty item on clearActivity', function () {
        selection.clearActivity();
        expect(fakeEvent.emitEvent).to.have.been.calledWith('rgTable:activateItem', null);
      });
    });

    describe('Checking', function () {
      it('Should check item', function () {
        selection.checkItem(fakeData.items[2]);
        expect(fakeData.items[2].checked).to.be.true;
      });

      it('Should uncheck item', function () {
        fakeData.items[2].checked = true;
        selection.uncheckItem(fakeData.items[2]);
        expect(fakeData.items[2].checked).to.be.false;
      });

      it('Should toggle checking', function () {
        fakeData.items[2].checked = true;
        selection.toggleCheck(fakeData.items[2]);
        expect(fakeData.items[2].checked).to.be.false;
      });

      it('Should return all checked items', function () {
        fakeData.items[1].checked = true;
        fakeData.items[3].checked = true;
        var checkedItems = selection.getCheckedItems();

        expect(checkedItems.length).to.equal(2);
        expect(checkedItems[0]).to.equal(fakeData.items[1]);
        expect(checkedItems[1]).to.equal(fakeData.items[3]);
      });

      it('Should trigger rgTable:selectionChanged event on checking', function () {
        selection.checkItem(fakeData.items[2]);
        expect(fakeEvent.emitEvent).to.have.been.calledWith('rgTable:selectionChanged');
      });

      it('Should trigger rgTable:selectionChanged event on unchecking', function () {
        selection.uncheckItem(fakeData.items[2]);
        expect(fakeEvent.emitEvent).to.have.been.calledWith('rgTable:selectionChanged');
      });
    });

    describe('Table row', function () {
      it('Should activate item on clicking row', function () {
        element.find('.ring-table__row:nth-child(4)').click();
        scope.$digest();

        expect(directiveController.selection.getActiveItem()).to.equal(fakeData.items[2]);
      });
    });
  });
});

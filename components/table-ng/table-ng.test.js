require('angular');
require('angular-mocks');
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

    it('Should set correct unlimited columns width', function () {
      element = $compile(
        '<rg-table items="data.items">' +
        '<rg-table-header></rg-table-header>' +
        '<rg-table-row row-item="item" ng-repeat="item in data.items">' +
          '<rg-table-column unlimited>{{item.id}}</rg-table-column>' +
          '<rg-table-column unlimited>{{item.name}}</rg-table-column>' +
          '<rg-table-column unlimited>{{item.name}}</rg-table-column>' +
        '</rg-table-row>' +
        '</rg-table>'
      )(scope);
      scope.$digest();

      var $columns = $('.ring-table__row:first .ring-table__column', element);
      $columns.get(0).style.width.should.be.equal('33%');
      $columns.get(1).style.width.should.be.equal('33%');
    });
  });


  describe('Selection', function () {
    var selection;
    var fakeEvent = {};

    beforeEach(function () {
      fakeEvent.emitEvent = sinon.stub();
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

    describe('Default table navigation actions', function () {
      var SelectionNavigateActions = require('./table-ng__selection-navigate-actions');
      var navigateActions;
      beforeEach(function () {
        navigateActions = new SelectionNavigateActions();
      });

      it('should export interface', function () {
        expect(navigateActions.setSelection).to.be.defined;
        expect(navigateActions.moveUp).to.be.defined;
        expect(navigateActions.moveDown).to.be.defined;
        expect(navigateActions.reset).to.be.defined;
        expect(navigateActions.selectUp).to.be.defined;
        expect(navigateActions.selectDown).to.be.defined;
        expect(navigateActions.selectCurrent).to.be.defined;
        expect(navigateActions.clearSelection).to.be.defined;
      });

      it('should do nothing if selection is not put', function () {
        expect(navigateActions.moveUp()).to.be.false;
        expect(navigateActions.moveDown()).to.be.false;
        expect(navigateActions.reset()).to.be.false;
        expect(navigateActions.selectUp()).to.be.false;
        expect(navigateActions.selectDown()).to.be.false;
        expect(navigateActions.selectCurrent()).to.be.false;
        expect(navigateActions.clearSelection()).to.be.false;
      });

      describe('Default table navigation actions\' methods', function () {
        beforeEach(function () {
          navigateActions.setSelection(selection);
        });

        it('should select next item', function () {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[1]);

          navigateActions.moveDown();
          expect(selection.getActiveItemIndex()).to.equals(2);
        });

        it('should select prev item', function () {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[1]);

          navigateActions.moveUp();
          expect(selection.getActiveItemIndex()).to.equals(0);
        });

        it('should clear selection', function () {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[1]);
          selection.checkItem(fakeData.items[1]);

          navigateActions.clearSelection();
          expect(selection.getCheckedItems().length).to.equals(0);
        });

        it('should select current', function () {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[1]);

          navigateActions.selectCurrent();
          var result = selection.getCheckedItems();
          expect(result.length).to.equals(1);
          expect(result[0]).to.equals(fakeData.items[1]);
        });

        it('should select up', function () {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[2]);
          selection.checkItem(fakeData.items[2]);

          navigateActions.selectUp();
          expect(selection.getCheckedItems().length).to.equals(0);
          expect(selection.getActiveItemIndex()).to.equals(1);
        });

        it('should select down', function () {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[2]);

          navigateActions.selectDown();
          var result = selection.getCheckedItems();
          expect(result.length).to.equals(1);
          expect(result[0]).to.equals(fakeData.items[2]);
          expect(selection.getActiveItemIndex()).to.equals(3);
        });

        it('should select down multiple times', function () {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[1]);

          navigateActions.selectDown();
          navigateActions.selectDown();
          var result = selection.getCheckedItems();
          expect(result.length).to.equals(2);
          expect(result[0]).to.equals(fakeData.items[1]);
          expect(result[1]).to.equals(fakeData.items[2]);
          expect(selection.getActiveItemIndex()).to.equals(3);
        });
      });
    });
  });
});

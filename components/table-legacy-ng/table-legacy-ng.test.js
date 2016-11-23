import 'angular';
import 'angular-mocks';
import './table-legacy-ng';
import TableSelection from './table-legacy-ng__selection';

describe('Table Legacy Ng', () => {
  let scope;
  let directiveController;
  let element;
  let $compile;
  const fakeData = {
    items: [],
    loadMore() {}
  };

  beforeEach(() => {
    //Restoring items before each test to prevent side effects
    fakeData.items = [
      {id: 1, name: 'test1'},
      {id: 2, name: 'test2'},
      {id: 3, name: 'test3'},
      {id: 4, name: 'test4'}
    ];
  });

  beforeEach(window.module('Ring.table-legacy'));

  /* global inject */
  beforeEach(inject(($rootScope, _$compile_) => {
    scope = $rootScope.$new();
    $compile = _$compile_;

    scope.data = fakeData;

    element = $compile(
    '<rg-legacy-table items="data.items">' +
      '<rg-legacy-table-header></rg-legacy-table-header>' +
      '<rg-legacy-table-row row-item="item" ng-repeat="item in data.items">' +
        '<div class="ring-table__column">{{item.id}}</div>' +
      '</rg-legacy-table-row>' +
    '</rg-legacy-table>'
    )(scope);

    scope.$digest();
    directiveController = element.controller('rgLegacyTable');
  }));

  describe('DOM', () => {
    it('Should place table inside', () => {
      element[0].should.contain('table');
    });

    it('Should place all items inside table', () => {
      const rows = element[0].queryAll('.ring-table__row');
      rows.should.have.length(fakeData.items.length);
    });

    it('Should set correct unlimited columns width', () => {
      element = $compile(
        '<rg-legacy-table items="data.items">' +
        '<rg-legacy-table-header></rg-legacy-table-header>' +
        '<rg-legacy-table-row row-item="item" ng-repeat="item in data.items">' +
          '<rg-legacy-table-column unlimited>{{item.id}}</rg-legacy-table-column>' +
          '<rg-legacy-table-column unlimited>{{item.name}}</rg-legacy-table-column>' +
          '<rg-legacy-table-column unlimited>{{item.name}}</rg-legacy-table-column>' +
        '</rg-legacy-table-row>' +
        '</rg-legacy-table>'
      )(scope);
      scope.$digest();

      const columns = element[0].query('.ring-table__row').queryAll('.ring-table__column');
      columns[0].style.should.have.property('width', '33%');
      columns[1].style.should.have.property('width', '33%');
    });
  });

  describe('Selection', () => {
    let selection;
    const fakeEvent = {};

    beforeEach(() => {
      fakeEvent.emitEvent = sinon.stub();
      selection = new TableSelection(fakeData.items, fakeEvent.emitEvent.bind(fakeEvent));
    });

    it('Should receive items and store it inside instance', () => {
      expect(selection.items).to.equal(fakeData.items);
    });

    describe('Activation, deactivation, etc', () => {
      it('Should mark item as active on activateItem', () => {
        selection.activateItem(fakeData.items[1]);
        expect(selection.getActiveItem()).to.equal(fakeData.items[1]);
      });

      it('Should return active item from getActiveItem', () => {
        selection.activateItem(fakeData.items[2]);
        expect(fakeData.items[2].active).to.be.true;
      });

      it('Should clear other active item on activateItem', () => {
        selection.activateItem(fakeData.items[2]);
        expect(fakeData.items[2].active).to.be.true;
      });

      it('Should unmark item as active on next item activation', () => {
        selection.activateItem(fakeData.items[2]);
        selection.activateItem(fakeData.items[3]);
        expect(fakeData.items[2].active).to.be.false;
        expect(fakeData.items[3].active).to.be.true;
      });

      it('Should move selection down on activateNextItem', () => {
        selection.activateItem(fakeData.items[2]);
        selection.activateNextItem();
        expect(fakeData.items[3].active).to.be.true;
      });

      it('Should move selection up on activatePreviousItem', () => {
        selection.activateItem(fakeData.items[2]);
        selection.activatePreviousItem();
        expect(fakeData.items[1].active).to.be.true;
      });

      it('Should deactivate active item if first is active and then moving up', () => {
        selection.activateItem(fakeData.items[0]);
        selection.activatePreviousItem();
        expect(selection.getActiveItem()).to.be.undefined;
      });

      it('Should trigger rgLegacyTable:activateItem event on activation', () => {
        selection.activateItem(fakeData.items[0]);
        expect(fakeEvent.emitEvent).to.have.been.calledWith('rgLegacyTable:activateItem', fakeData.items[0]);
      });

      it('Should trigger rgLegacyTable:activateItem with empty item on clearActivity', () => {
        selection.clearActivity();
        expect(fakeEvent.emitEvent).to.have.been.calledWith('rgLegacyTable:activateItem', null);
      });
    });

    describe('Checking', () => {
      it('Should check item', () => {
        selection.checkItem(fakeData.items[2]);
        expect(fakeData.items[2].checked).to.be.true;
      });

      it('Should uncheck item', () => {
        fakeData.items[2].checked = true;
        selection.uncheckItem(fakeData.items[2]);
        expect(fakeData.items[2].checked).to.be.false;
      });

      it('Should toggle checking', () => {
        fakeData.items[2].checked = true;
        selection.toggleCheck(fakeData.items[2]);
        expect(fakeData.items[2].checked).to.be.false;
      });

      it('Should return all checked items', () => {
        fakeData.items[1].checked = true;
        fakeData.items[3].checked = true;
        const checkedItems = selection.getCheckedItems();

        expect(checkedItems.length).to.equal(2);
        expect(checkedItems[0]).to.equal(fakeData.items[1]);
        expect(checkedItems[1]).to.equal(fakeData.items[3]);
      });

      it('Should trigger rgLegacyTable:selectionChanged event on checking', () => {
        selection.checkItem(fakeData.items[2]);
        expect(fakeEvent.emitEvent).to.have.been.calledWith('rgLegacyTable:selectionChanged');
      });

      it('Should trigger rgLegacyTable:selectionChanged event on unchecking', () => {
        selection.uncheckItem(fakeData.items[2]);
        expect(fakeEvent.emitEvent).to.have.been.calledWith('rgLegacyTable:selectionChanged');
      });
    });

    describe('Table row', () => {
      it('Should activate item on clicking row', () => {
        element[0].query('.ring-table__row:nth-child(4)').dispatchEvent(new CustomEvent('click'));
        scope.$digest();

        expect(directiveController.selection.getActiveItem()).to.equal(fakeData.items[2]);
      });
    });

    describe('Default table navigation actions', () => {
      const SelectionNavigateActions = require('./table-legacy-ng__selection-navigate-actions');
      let navigateActions;
      beforeEach(() => {
        navigateActions = new SelectionNavigateActions();
      });

      it('should export interface', () => {
        expect(navigateActions.setSelection).to.be.defined;
        expect(navigateActions.moveUp).to.be.defined;
        expect(navigateActions.moveDown).to.be.defined;
        expect(navigateActions.reset).to.be.defined;
        expect(navigateActions.selectUp).to.be.defined;
        expect(navigateActions.selectDown).to.be.defined;
        expect(navigateActions.selectCurrent).to.be.defined;
        expect(navigateActions.clearSelection).to.be.defined;
      });

      it('should do nothing if selection is not put', () => {
        expect(navigateActions.moveUp()).to.be.false;
        expect(navigateActions.moveDown()).to.be.false;
        expect(navigateActions.reset()).to.be.false;
        expect(navigateActions.selectUp()).to.be.false;
        expect(navigateActions.selectDown()).to.be.false;
        expect(navigateActions.selectCurrent()).to.be.false;
        expect(navigateActions.clearSelection()).to.be.false;
      });

      describe('Default table navigation actions\' methods', () => {
        beforeEach(() => {
          navigateActions.setSelection(selection);
        });

        it('should select next item', () => {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[1]);

          navigateActions.moveDown();
          expect(selection.getActiveItemIndex()).to.equals(2);
        });

        it('should select prev item', () => {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[1]);

          navigateActions.moveUp();
          expect(selection.getActiveItemIndex()).to.equals(0);
        });

        it('should clear selection', () => {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[1]);
          selection.checkItem(fakeData.items[1]);

          navigateActions.clearSelection();
          expect(selection.getCheckedItems().length).to.equals(0);
        });

        it('should select current', () => {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[1]);

          navigateActions.selectCurrent();
          const result = selection.getCheckedItems();
          expect(result.length).to.equals(1);
          expect(result[0]).to.equals(fakeData.items[1]);
        });

        it('should select up', () => {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[2]);
          selection.checkItem(fakeData.items[2]);

          navigateActions.selectUp();
          expect(selection.getCheckedItems().length).to.equals(0);
          expect(selection.getActiveItemIndex()).to.equals(1);
        });

        it('should select down', () => {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[2]);

          navigateActions.selectDown();
          const result = selection.getCheckedItems();
          expect(result.length).to.equals(1);
          expect(result[0]).to.equals(fakeData.items[2]);
          expect(selection.getActiveItemIndex()).to.equals(3);
        });

        it('should select down multiple times', () => {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[1]);

          navigateActions.selectDown();
          navigateActions.selectDown();
          const result = selection.getCheckedItems();
          expect(result.length).to.equals(2);
          expect(result[0]).to.equals(fakeData.items[1]);
          expect(result[1]).to.equals(fakeData.items[2]);
          expect(selection.getActiveItemIndex()).to.equals(3);
        });
      });
    });
  });
});

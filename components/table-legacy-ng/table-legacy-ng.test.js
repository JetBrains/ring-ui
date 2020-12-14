/* eslint-disable no-magic-numbers */
import 'angular';
import 'angular-mocks';
import './table-legacy-ng';
import TableSelection from './table-legacy-ng__selection';
import SelectionNavigateActions from './table-legacy-ng__selection-navigate-actions';

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
      const rows = element[0].querySelectorAll('.ring-table__row');
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

      const columns = element[0].querySelector('.ring-table__row').querySelectorAll('.ring-table__column');
      columns[0].style.should.have.property('width', '33%');
      columns[1].style.should.have.property('width', '33%');
    });
  });

  describe('Selection', () => {
    let selection;
    const fakeEvent = {};

    beforeEach(() => {
      fakeEvent.emitEvent = sandbox.stub();
      selection = new TableSelection(fakeData.items, fakeEvent.emitEvent.bind(fakeEvent));
    });

    it('Should receive items and store it inside instance', () => {
      selection.items.should.equal(fakeData.items);
    });

    describe('Activation, deactivation, etc', () => {
      it('Should mark item as active on activateItem', () => {
        selection.activateItem(fakeData.items[1]);
        selection.getActiveItem().should.equal(fakeData.items[1]);
      });

      it('Should return active item from getActiveItem', () => {
        selection.activateItem(fakeData.items[2]);
        fakeData.items[2].active.should.be.true;
      });

      it('Should clear other active item on activateItem', () => {
        selection.activateItem(fakeData.items[2]);
        fakeData.items[2].active.should.be.true;
      });

      it('Should unmark item as active on next item activation', () => {
        selection.activateItem(fakeData.items[2]);
        selection.activateItem(fakeData.items[3]);
        fakeData.items[2].active.should.be.false;
        fakeData.items[3].active.should.be.true;
      });

      it('Should move selection down on activateNextItem', () => {
        selection.activateItem(fakeData.items[2]);
        selection.activateNextItem();
        fakeData.items[3].active.should.be.true;
      });

      it('Should move selection up on activatePreviousItem', () => {
        selection.activateItem(fakeData.items[2]);
        selection.activatePreviousItem();
        fakeData.items[1].active.should.be.true;
      });

      it('Should deactivate active item if first is active and then moving up', () => {
        selection.activateItem(fakeData.items[0]);
        selection.activatePreviousItem();
        should.not.exist(selection.getActiveItem());
      });

      it('Should trigger rgLegacyTable:activateItem event on activation', () => {
        selection.activateItem(fakeData.items[0]);
        fakeEvent.emitEvent.should.
          have.been.calledWith('rgLegacyTable:activateItem', fakeData.items[0]);
      });

      it('Should trigger rgLegacyTable:activateItem with empty item on clearActivity', () => {
        selection.clearActivity();
        fakeEvent.emitEvent.should.have.been.calledWith('rgLegacyTable:activateItem', null);
      });
    });

    describe('Checking', () => {
      it('Should check item', () => {
        selection.checkItem(fakeData.items[2]);
        fakeData.items[2].checked.should.be.true;
      });

      it('Should uncheck item', () => {
        fakeData.items[2].checked = true;
        selection.uncheckItem(fakeData.items[2]);
        fakeData.items[2].checked.should.be.false;
      });

      it('Should toggle checking', () => {
        fakeData.items[2].checked = true;
        selection.toggleCheck(fakeData.items[2]);
        fakeData.items[2].checked.should.be.false;
      });

      it('Should return all checked items', () => {
        fakeData.items[1].checked = true;
        fakeData.items[3].checked = true;
        const checkedItems = selection.getCheckedItems();

        checkedItems.length.should.equal(2);
        checkedItems[0].should.equal(fakeData.items[1]);
        checkedItems[1].should.equal(fakeData.items[3]);
      });

      it('Should trigger rgLegacyTable:selectionChanged event on checking', () => {
        selection.checkItem(fakeData.items[2]);
        fakeEvent.emitEvent.should.have.been.calledWith('rgLegacyTable:selectionChanged');
      });

      it('Should trigger rgLegacyTable:selectionChanged event on unchecking', () => {
        selection.uncheckItem(fakeData.items[2]);
        fakeEvent.emitEvent.should.have.been.calledWith('rgLegacyTable:selectionChanged');
      });
    });

    describe('Table row', () => {
      it('Should activate item on clicking row', () => {
        element[0].querySelector('.ring-table__row:nth-child(4)').dispatchEvent(new CustomEvent('click'));
        scope.$digest();

        directiveController.selection.getActiveItem().should.equal(fakeData.items[2]);
      });
    });

    describe('Default table navigation actions', () => {
      let navigateActions;
      beforeEach(() => {
        navigateActions = new SelectionNavigateActions();
      });

      it('should export interface', () => {
        navigateActions.setSelection.should.exist;
        navigateActions.moveUp.should.exist;
        navigateActions.moveDown.should.exist;
        navigateActions.reset.should.exist;
        navigateActions.selectUp.should.exist;
        navigateActions.selectDown.should.exist;
        navigateActions.selectCurrent.should.exist;
        navigateActions.clearSelection.should.exist;
      });

      it('should do nothing if selection is not put', () => {
        navigateActions.moveUp().should.be.false;
        navigateActions.moveDown().should.be.false;
        navigateActions.reset().should.be.false;
        navigateActions.selectUp().should.be.false;
        navigateActions.selectDown().should.be.false;
        navigateActions.selectCurrent().should.be.false;
        navigateActions.clearSelection().should.be.false;
      });

      describe('Default table navigation actions\' methods', () => {
        beforeEach(() => {
          navigateActions.setSelection(selection);
        });

        it('should select next item', () => {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[1]);

          navigateActions.moveDown();
          selection.getActiveItemIndex().should.equals(2);
        });

        it('should select prev item', () => {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[1]);

          navigateActions.moveUp();
          selection.getActiveItemIndex().should.equals(0);
        });

        it('should clear selection', () => {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[1]);
          selection.checkItem(fakeData.items[1]);

          navigateActions.clearSelection();
          selection.getCheckedItems().length.should.equals(0);
        });

        it('should select current', () => {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[1]);

          navigateActions.selectCurrent();
          const result = selection.getCheckedItems();
          result.length.should.equals(1);
          result[0].should.equals(fakeData.items[1]);
        });

        it('should select up', () => {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[2]);
          selection.checkItem(fakeData.items[2]);

          navigateActions.selectUp();
          selection.getCheckedItems().length.should.equals(0);
          selection.getActiveItemIndex().should.equals(1);
        });

        it('should select down', () => {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[2]);

          navigateActions.selectDown();
          const result = selection.getCheckedItems();
          result.length.should.equals(1);
          result[0].should.equals(fakeData.items[2]);
          selection.getActiveItemIndex().should.equals(3);
        });

        it('should select down multiple times', () => {
          navigateActions.setSelection(selection);
          selection.activateItem(fakeData.items[1]);

          navigateActions.selectDown();
          navigateActions.selectDown();
          const result = selection.getCheckedItems();
          result.length.should.equals(2);
          result[0].should.equals(fakeData.items[1]);
          result[1].should.equals(fakeData.items[2]);
          selection.getActiveItemIndex().should.equals(3);
        });
      });
    });
  });
});

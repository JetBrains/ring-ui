/*global angular, inject*/

require('angular/angular');
require('angular-mocks/angular-mocks');
require('./table-ng');

describe('table-list', function() {
  var rootScope, element, resourceController, tableController, tableScope;

  var mockItems = [
    {name: 'item 1', 'field' : 'a'},
    {name: 'item 2', 'field' : 'b'},
    {name: 'item 3', 'field' : 'c'}
  ];

  beforeEach(window.module('Ring.table'));

  angular.module('Ring.shortcuts', []);
  angular.module('Ring.permissions', [])
    .value('userPermissions', {});


  angular.module('rg.mocks', [])
    .provider('i18nPlural', function() {
      this.$get = function() {
        return {
          format: function(message) {
            return message;
          }
        };
      };
    })
    .provider('storage', function() {
      var storage = {};

      this.$get = function() {
        return {
          set: function(key, value) {
            storage[key] = value;
          },
          get: function(key) {
            return {
              done: function(on_done) {
                if(on_done) {
                  var result = storage[key] ? storage[key] : null;
                  on_done.call(result);
                }
              }
            };
          }
        };
      };
    });

  beforeEach(window.module('rg.mocks'));

  beforeEach(inject(function($rootScope, $compile) {
    rootScope = $rootScope.$new();

    rootScope.data = {items: mockItems, total: mockItems.length, toogle: null};

    element = angular.element(
      '<div data="data">' +
        '<rg-table data="data" items="data.items" source="data.loadMore">' +
          '<rg-table-row item="item" ng-repeat="item in data.items"><div class="field">{{ item.name }}</div><div class="field">{{ item.field }}</div></rg-table-row>' +
        '</rg-table>' +
      '</div>'
    );

    $compile(element)(rootScope);
    rootScope.$digest();

    resourceController = element.controller('hubResource');
    tableController = element.find('div:first').controller('rgTable');
    tableScope = element.find('div:first').isolateScope();
  }));

  describe('DOM', function() {
    it('should create table and draw data.items', function() {
      expect(element.find('.table__row').length).to.equal(3);
    });

    it('every field should have two cells', function() {
      expect(element.find('.table__row:first .field').length).to.equal(2);
    });

    it('check values in cells', function() {
      expect(element.find('.table__row:first .field:last').html()).to.equal('a');
      expect(element.find('.table__row:last .field:last').html()).to.equal('c');
    });
  });

  describe('Table controller', function() {
    describe('active items and moves', function() {
      it('no item should be marked as active on start', function() {
        expect(tableController.getActiveItem()).to.be.null;
        expect(tableController.getActiveItemIndex()).to.be.undefined;
      });

      it('should set active item by index', function() {
        tableController.setActiveItemIndex(0);
        expect(tableController.getActiveItem().name).to.equal('item 1');
      });

      it('should set active item by index and move', function() {
        tableController.setActiveItemIndex(0);
        tableController.moveDown();
        expect(tableController.getActiveItem().name).to.equal('item 2');
        tableController.moveDown();
        expect(tableController.getActiveItem().name).to.equal('item 3');
        tableController.moveUp();
        expect(tableController.getActiveItem().name).to.equal('item 2');
      });
    });


    describe('ctrl.getSelection() empty', function() {
      it('should return empty selection first()', function () {
        expect(tableController.getSelection().first()).to.be.null;
      });

      it('should be nothing in each()', function () {
        var result = false;
        tableController.getSelection().each(function () {
          result = true;
        });
        expect(result).to.be.falsy;
      });

      it('should be nothing in some()', function () {
        var result = tableController.getSelection().some(function () {
          return true;
        });
        expect(result).to.be.falsy;
      });

      it('should return empty selection getAll()', function () {
        expect(tableController.getSelection().getAll()).to.eql([]);
      });
    });

    describe('ctrl.getSelection() not empty', function() {
      beforeEach(function() {
        tableController.setActiveItemIndex(0);
        tableController.checkedItems.setItem(0, tableController.getActiveItem(), true);
        tableController.setActiveItemIndex(1);
        tableController.checkedItems.setItem(1, tableController.getActiveItem(), true);
      });

      it('first() should return not empty selection', function() {
        var result = tableController.getSelection().first();
        expect(result.name).to.equal(mockItems[0].name);
      });

      it('some() should return true', function() {
        var result = tableController.getSelection().some(function(item) {
          if(item.name === mockItems[1].name) {
            return true;
          }
        });

        expect(result).to.be.true;
      });

      it('each() should do smth with all selected items', function() {
        var result = '';
        tableController.getSelection().each(function(index, item) {
          result += item.field;
        });

        expect(result).to.equal('ab');
      });

      it('getAll() should return array with all selected items', function() {
        var result = tableController.getSelection().getAll();
        expect(result.length).to.equal(2);
        expect(result[0].name).to.equal(mockItems[0].name);
        expect(result[1].name).to.equal(mockItems[1].name);
      });
    });
  });
});

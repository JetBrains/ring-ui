require('angular/angular');
require('angular-mocks/angular-mocks');

describe('ReactNg', function () {
  var React = require('react/addons');

  var registerComponents = require('./react-ng');

  var $scope;
  var $compile;
  var EmptyComponent = React.createClass({
    render: function() {
      return React.DOM.div();
    }
  });

  registerComponents({EmptyComponent: EmptyComponent});

  beforeEach(window.module('Ring.react-ng'));

  /* global inject */
  beforeEach(inject(function ($rootScope, _$compile_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  //common checker for properties passing
  function checkPropertyPassingForTemplate(template, propname, propalue){
    var TestPropsComponent = React.createClass({
      render: function() {
        expect(this.props[propname]).to.equal(propalue);
        return React.DOM.div();
      }
    });

    registerComponents({
      TestPropsComponent: TestPropsComponent
    });

    $compile(template)($scope);
    $scope.$digest();
  }

  describe('react directive', function () {
    it('should transfer inlined props to react component', function () {
      checkPropertyPassingForTemplate('<div react="TestPropsComponent" testprop="\'test\'"></div>', 'testprop', 'test');
    });

    it('should pass props from scope to react component', function () {
      $scope.fromScope = 'fromScopeProperty';

      checkPropertyPassingForTemplate('<div react="TestPropsComponent" from-scope="fromScope"></div>', 'fromScope', 'fromScopeProperty');
    });

    it('should write component instance in provided scope variable', function () {

      $scope.instanceFieldName = 'componentInstance';

      $compile('<div react="EmptyComponent" react-instance="instanceFieldName"></div>')($scope);
      $scope.$digest();

      expect($scope.componentInstance).to.be.defined;
    });
  });

  describe('react directive with ngmodel', function () {
    it('should pass ng-model to ng-model state property', function () {

      $scope.defaultCheckboxState = true;
      $scope.instanceFieldName = 'componentInstance';

      $compile('<div react="Checkbox" ng-model="defaultCheckboxState" react-instance="instanceFieldName"></div>')($scope);
      $scope.$digest();

      expect($scope.componentInstance.state.checked).to.be.true;
    });
  });

  describe('react-static directive', function () {
    it('react-static should transfer props to react component instance', function () {
      checkPropertyPassingForTemplate('<div react-static="TestPropsComponent" react-testprop="\'test\'"></div>', 'testprop', 'test');
    });

    it('react-static shouldn\'t transfer props without "react-" prefix', function () {
      checkPropertyPassingForTemplate('<div react-static="TestPropsComponent" withoutprefix="\'test\'"></div>', 'withoutprefix', undefined);
    });
    it('react-static should pass props from scope to react component', function () {
      $scope.fromScope = 'fromScopeProperty';
      checkPropertyPassingForTemplate('<div react-static="TestPropsComponent" react-from-scope="fromScope"></div>', 'fromScope', 'fromScopeProperty');
    });
  });
});

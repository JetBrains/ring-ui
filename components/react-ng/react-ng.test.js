/* eslint-disable react/no-multi-comp */

import 'angular';
import 'angular-mocks';
import React from 'react';
import RingComponent from '../ring-component/ring-component';
import Checkbox from '../checkbox/checkbox';

describe('ReactNg', function () {
  const registerComponents = require('./react-ng');

  let $scope;
  let $compile;

  function EmptyComponent() {
    return <div />;
  }

  registerComponents({EmptyComponent, Checkbox});

  beforeEach(window.module('Ring.react-ng'));

  /* global inject */
  beforeEach(inject(function ($rootScope, _$compile_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  //common checker for properties passing
  function checkPropertyPassingForTemplate(template, propname, propvalue) {
    class TestPropsComponent extends RingComponent {
      render() {
        expect(this.props[propname]).to.equal(propvalue);
        return <div />;
      }
    }

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

    it('should write component instance in provided scope constiable', function () {
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

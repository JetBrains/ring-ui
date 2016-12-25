/* eslint-disable react/no-multi-comp */

import 'angular';
import 'angular-mocks';
import React from 'react';
import RingComponent from '../ring-component/ring-component';
import Checkbox from '../checkbox/checkbox';

describe('React Ng', () => {
  const registerComponents = require('./react-ng');

  let $scope;
  let $compile;

  registerComponents({Checkbox});

  beforeEach(window.module('Ring.react-ng'));

  /* global inject */
  beforeEach(inject(($rootScope, _$compile_) => {
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

    registerComponents({TestPropsComponent});

    $compile(template)($scope);
    $scope.$digest();
  }

  describe('react directive', () => {
    it('should transfer inlined props to react component', () => {
      checkPropertyPassingForTemplate('<div react="TestPropsComponent" testprop="\'test\'"></div>', 'testprop', 'test');
    });

    it('should pass props from scope to react component', () => {
      $scope.fromScope = 'fromScopeProperty';

      checkPropertyPassingForTemplate('<div react="TestPropsComponent" from-scope="fromScope"></div>', 'fromScope', 'fromScopeProperty');
    });

    it('should write component instance in provided scope field', () => {
      $scope.instanceFieldName = 'componentInstance';

      $compile('<div react="Checkbox" react-instance="instanceFieldName"></div>')($scope);
      $scope.$digest();

      $scope.componentInstance.should.be.defined;
    });

    it('should write component instance in provided nested scope field', () => {
      $scope.instanceField = {};
      $scope.instanceFieldName = 'instanceField.componentInstance';

      $compile('<div react="Checkbox" react-instance="instanceFieldName"></div>')($scope);
      $scope.$digest();

      $scope.instanceField.componentInstance.should.be.defined;
    });
  });

  describe('react directive with ngmodel', () => {
    it('should pass ng-model to ng-model state property', () => {

      $scope.defaultCheckboxState = true;
      $scope.instanceFieldName = 'componentInstance';

      $compile('<div react="Checkbox" ng-model="defaultCheckboxState" react-instance="instanceFieldName"></div>')($scope);
      $scope.$digest();

      $scope.componentInstance.refs.input.checked.should.to.be.true;
    });
  });

  describe('react-static directive', () => {
    it('react-static should transfer props to react component instance', () => {
      checkPropertyPassingForTemplate('<div react-static="TestPropsComponent" react-testprop="\'test\'"></div>', 'testprop', 'test');
    });

    it('react-static shouldn\'t transfer props without "react-" prefix', () => {
      checkPropertyPassingForTemplate('<div react-static="TestPropsComponent" withoutprefix="\'test\'"></div>', 'withoutprefix', undefined);
    });
    it('react-static should pass props from scope to react component', () => {
      $scope.fromScope = 'fromScopeProperty';
      checkPropertyPassingForTemplate('<div react-static="TestPropsComponent" react-from-scope="fromScope"></div>', 'fromScope', 'fromScopeProperty');
    });
  });
});

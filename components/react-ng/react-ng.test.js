import 'angular';
import 'angular-mocks';
import React from 'react';

import RingComponent from '../ring-component/ring-component';
import TagsInput from '../tags-input/tags-input';

import registerComponents from './react-ng';

describe('React Ng', () => {
  let $scope;
  let $compile;

  registerComponents({TagsInput});

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
        // handle undefined values
        (propvalue === this.props[propname]).should.be.true;
        return <div/>;
      }
    }

    registerComponents({TestPropsComponent});

    $compile(template)($scope);
    $scope.$digest();
  }

  describe('react directive', () => {
    it('should transfer inlined props to react component', () => {
      checkPropertyPassingForTemplate(
        '<div react="TestPropsComponent" testprop="\'test\'"></div>',
        'testprop',
        'test'
      );
    });

    it('should pass props from scope to react component', () => {
      $scope.fromScope = 'fromScopeProperty';

      checkPropertyPassingForTemplate(
        '<div react="TestPropsComponent" from-scope="fromScope"></div>',
        'fromScope',
        'fromScopeProperty'
      );
    });

    it('should write component instance in provided scope field', () => {
      $scope.instanceFieldName = 'componentInstance';

      $compile('<div react="TagsInput" react-instance="instanceFieldName"></div>')($scope);
      $scope.$digest();

      $scope.componentInstance.should.exist;
    });

    it('should write component instance in provided nested scope field', () => {
      $scope.instanceField = {};
      $scope.instanceFieldName = 'instanceField.componentInstance';

      $compile('<div react="TagsInput" react-instance="instanceFieldName"></div>')($scope);
      $scope.$digest();

      $scope.instanceField.componentInstance.should.exist;
    });
  });

  describe('react directive with ngmodel', () => {
    it('should pass ng-model to ng-model state property', () => {
      const TEST_ID = 123;
      $scope.defaultTags = [{id: TEST_ID, key: TEST_ID}];
      $scope.instanceFieldName = 'componentInstance';

      $compile('<div react="TagsInput" ng-model="defaultTags" react-instance="instanceFieldName"></div>')($scope);
      $scope.$digest();

      $scope.componentInstance.state.tags[0].id.should.equal(TEST_ID);
    });
  });

  describe('react-static directive', () => {
    it('react-static should transfer props to react component instance', () => {
      checkPropertyPassingForTemplate(
        '<div react-static="TestPropsComponent" react-testprop="\'test\'"></div>',
        'testprop',
        'test'
      );
    });

    it('react-static shouldn\'t transfer props without "react-" prefix', () => {
      checkPropertyPassingForTemplate(
        '<div react-static="TestPropsComponent" withoutprefix="\'test\'"></div>',
        'withoutprefix',
        undefined
      );
    });
    it('react-static should pass props from scope to react component', () => {
      $scope.fromScope = 'fromScopeProperty';
      checkPropertyPassingForTemplate(
        '<div react-static="TestPropsComponent" react-from-scope="fromScope"></div>',
        'fromScope',
        'fromScopeProperty'
      );
    });
  });
});

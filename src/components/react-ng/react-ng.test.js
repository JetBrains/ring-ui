'use strict';

describe('React-ng', function () {
	var React = require('react/addons');

	require('angular/angular');
	require('angular-mocks/angular-mocks');
	var registerComponents = require('./react-ng');

	var $scope, $compile,
    EmptyComponent = React.createClass({
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

	it('Should transfer inlined props to react component', function () {
    checkPropertyPassingForTemplate('<div react="TestPropsComponent" testprop="\'test\'"></div>', 'testprop', 'test');
	});

  it('React-static should transfer props to react component instance', function () {
    checkPropertyPassingForTemplate('<div react-static="TestPropsComponent" testprop="\'test\'"></div>', 'testprop', 'test');
  });

  it('Should pass props from scope to react component', function () {
    $scope.fromScope = 'fromScopeProperty';

    checkPropertyPassingForTemplate('<div react="TestPropsComponent" from-scope="fromScope"></div>', 'fromScope', 'fromScopeProperty');
  });

  it('React-static should pass props from scope to react component', function () {
    $scope.fromScope = 'fromScopeProperty';
    checkPropertyPassingForTemplate('<div react-static="TestPropsComponent" from-scope="fromScope"></div>', 'fromScope', 'fromScopeProperty');
  });

  it('Should write component instance in provided scope variable', function () {

    $scope.instanceFieldName = 'componentInstance';

    $compile('<div react="EmptyComponent" react-instance="instanceFieldName"></div>')($scope);
    $scope.$digest();

    expect($scope.componentInstance).to.be.defined;
  });

});

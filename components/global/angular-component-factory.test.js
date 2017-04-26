/* global inject: false */
/* global angular: false */

import 'angular';
import 'angular-mocks';
import React from 'react';
import PropTypes from 'prop-types';
import {Simulate} from 'react-dom/test-utils';

import RingComponent from '../ring-component/ring-component';

import angularComponentFactory from './angular-component-factory';

class TestComponent extends RingComponent {
  static propTypes = {
    id: PropTypes.string,
    someObj: PropTypes.object,
    onClick: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    someObj: {}
  };

  render() {
    const {id, someObj, onClick, className} = this.props;
    return (
      <div
        id={id}
        data-some-obj={someObj.foo}
        onClick={function handleClick() {
          onClick('payload');
        }}
        className={className}
      />
    );
  }
}

const testModule = angularComponentFactory(TestComponent, 'TestComponent').name;

describe('angularComponentFactory', () => {
  let $componentController;
  let $compile;
  let $rootScope;

  beforeEach(window.module(testModule));

  beforeEach(inject((_$componentController_, _$compile_, _$rootScope_) => {
    $componentController = _$componentController_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('should return an Angular module with the proper name', () => {
    testModule.should.be.equal('Ring.testComponent');
  });

  it('should register an Angular component with the proper name', () => {
    const $element = angular.element('<div></div>');
    const $transclude = callback => callback();
    const ctrl = $componentController('rgTestComponent', {
      $scope: $rootScope,
      $element,
      $transclude
    });
    ctrl.should.not.be.undefined;
  });

  it('should use one-way binding for object props', () => {
    $rootScope.testObj = {
      foo: 'bar'
    };
    const $element = $compile(
      '<rg-test-component some-obj="testObj"></rg-test-component>'
    )($rootScope);
    const component = $element[0].firstChild;
    component.should.have.attribute('data-some-obj', 'bar');

    $rootScope.testObj = {
      foo: 'test value'
    };
    $rootScope.$digest();
    component.should.have.attribute('data-some-obj', 'test value');
  });

  it('should warn if one modify inner properties of passed object', function () { // eslint-disable-line func-names
    this.sinon.stub(console, 'warn');

    $rootScope.testObj = {
      foo: 'bar'
    };

    $compile('<rg-test-component some-obj="testObj"></rg-test-component>')($rootScope);

    $rootScope.testObj.foo = 'test-value';

    // eslint-disable-next-line no-console
    console.warn.should.have.been.called;
  });

  it('should use string binding for string props', () => {
    $rootScope.id = '1';
    const $element = $compile('<rg-test-component id="id"></rg-test-component>')($rootScope);
    const component = $element[0].firstChild;
    component.should.have.attribute('id', '1');

    $rootScope.id = '2';
    $rootScope.$digest();
    component.should.have.attribute('id', '2');
  });

  it('should pass given css classes', () => {
    const $element = $compile(
      '<rg-test-component class-name="\'test-class1 test-class2\'"></rg-test-component>'
    )($rootScope);
    const component = $element[0].firstChild;
    component.should.have.class('test-class1');
    component.should.have.class('test-class2');
  });

  it('should use one-way binding for function props', function () { // eslint-disable-line func-names
    $rootScope.callback = this.sinon.spy();
    const $element = $compile(
      '<rg-test-component on-click="callback"></rg-test-component>'
    )($rootScope);
    const component = $element[0].firstChild;

    Simulate.click(component);

    $rootScope.callback.should.have.been.called;
    $rootScope.callback.should.have.been.calledWith('payload');
  });
});

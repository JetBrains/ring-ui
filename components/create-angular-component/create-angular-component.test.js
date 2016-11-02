/* global inject: false */
/* global angular: false */

import 'angular';
import 'angular-mocks';

import React, {PropTypes} from 'react';
import RingComponent from '../ring-component/ring-component';
import createAngularComponent from './create-angular-component';

class TestComponent extends RingComponent {
  static propTypes = {
    id: PropTypes.string,
    callback: PropTypes.func,
    className: PropTypes.string
  }

  render() {
    const {id, callback, className} = this.props;
    return (
      <div
        id={id}
        onClick={callback({arg: 'a'})}
        className={className}
      />
    );
  }
}

const testModule = createAngularComponent(TestComponent).name;

describe('createAngularComponent', () => {
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
    const ctrl = $componentController('rgTestComponent', {$scope: $rootScope, $element});
    ctrl.should.not.be.undefined;
  });

  it('should use one-way binding for props', () => {
    $rootScope.id = '1';
    const $element = $compile('<rg-test-component id="id"></rg-test-component>')($rootScope);
    const component = $element[0].firstChild;
    component.should.have.attribute('id', '1');

    $rootScope.id = '2';
    $rootScope.$digest();
    component.should.have.attribute('id', '2');
  });

  it('should pass given css classes', () => {
    const $element = $compile('<rg-test-component class="test-class1 test-class2"></rg-test-component>')($rootScope);
    const component = $element[0].firstChild;
    component.should.have.class('test-class1');
    component.should.have.class('test-class2');
  });

  it('should pass function props as &-bindings', function () {
    $rootScope.callback = this.sinon.spy();
    const $element = $compile('<rg-test-component callback="callback(arg)"></rg-test-component>')($rootScope);
    const component = $element[0].firstChild;

    component.dispatchEvent(new MouseEvent('click'));
    $rootScope.$digest();

    $rootScope.callback.should.have.been.called;
    $rootScope.callback.should.have.been.calledWith('a');
  });
});

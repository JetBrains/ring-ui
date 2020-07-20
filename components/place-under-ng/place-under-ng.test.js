import angular from 'angular';

import EventEmitter from 'events';

import 'angular-mocks';

import rgPlaceUnder from './place-under-ng';


describe('Place Under Ng', () => {


  beforeEach(window.module(
    rgPlaceUnder
  ));


  let $windowMock;
  let documentMock;
  let bodyMock;
  let windowEventEmitter;
  beforeEach(window.module($provide => {
    documentMock = angular.element('<document/>')[0];
    bodyMock = angular.element('<body/>')[0];
    documentMock.body = bodyMock;

    windowEventEmitter = new EventEmitter();

    $windowMock = {
      addEventListener: (eventName, callback) => windowEventEmitter.on(eventName, callback),
      removeEventListener:
        (eventName, callback) => windowEventEmitter.removeListener(eventName, callback),
      setTimeout: window.setTimeout.bind(window),
      document: documentMock
    };
    $provide.value('$window', $windowMock);
  }));


  let $rootScope;
  let $compile;
  let runDigest;
  beforeEach(window.inject((_$rootScope_, _$compile_) => {
    $rootScope = _$rootScope_;
    $compile = _$compile_;

    runDigest = () => {
      $rootScope.$apply();
    };
  }));


  describe('rgPlaceUnder', () => {


    let $scope;
    let element;
    beforeEach(() => {
      $scope = $rootScope.$new();

      element = $compile('<div id="testNode" rg-place-under="#testNode"/>')($scope)[0];
      runDigest();
    });


    it('should compile directive', () => {
      element.should.have.class('ng-scope');
    });
  });


  describe('rgPlaceUnderHelper', () => {


    let clock;
    beforeEach(() => {
      clock = sandbox.useFakeTimers({toFake: ['setTimeout', 'clearTimeout']});
    });


    let $scope;
    let rgPlaceUnderHelper;
    let elementMock;
    let syncElementMock;
    let attrsMock;
    let synchronizer;
    let flushDebounce;
    beforeEach(window.inject(_rgPlaceUnderHelper_ => {
      rgPlaceUnderHelper = _rgPlaceUnderHelper_;

      $scope = $rootScope.$new();
      attrsMock = {};
      elementMock = angular.element('<div/>')[0];
      syncElementMock = angular.element('<div/>')[0];

      synchronizer = rgPlaceUnderHelper.createPositionSynchronizer(
        elementMock,
        attrsMock,
        $scope
      );
      sandbox.stub(synchronizer, 'onScroll');

      flushDebounce = () => {
        clock.tick(rgPlaceUnderHelper.DEBOUNCE_INTERVAL);
      };
    }));


    it('should sync position', () => {
      synchronizer.syncPositionWith(syncElementMock);
    });


    it('should call onScroll on window scroll event', () => {
      synchronizer.syncPositionWith(syncElementMock);

      windowEventEmitter.emit('scroll');
      flushDebounce();

      synchronizer.onScroll.should.have.been.called;
    });

    it('should call recheck scroll position after some delay after scroll events finish', () => {
      const BIG_TICK = 500;
      synchronizer.syncPositionWith(syncElementMock);

      windowEventEmitter.emit('scroll');
      flushDebounce();
      windowEventEmitter.emit('scroll');
      clock.tick(BIG_TICK);

      synchronizer.onScroll.should.have.been.calledThrice;
    });


    it('should allow call onScroll manually using scope', () => {
      synchronizer.syncPositionWith(syncElementMock);

      $scope.$emit('rgPlaceUnder:sync');
      flushDebounce();

      synchronizer.onScroll.should.have.been.called;
    });


    it('should call onScroll when change show property', () => {
      synchronizer.syncPositionWith(syncElementMock);

      $scope.show = !$scope.show;
      runDigest();
      flushDebounce();

      synchronizer.onScroll.should.have.been.called;
    });


    it('should remove previous listeners if we call syncPositionWith twice', () => {
      let callCount = 0;
      synchronizer.syncPositionWith(syncElementMock);
      synchronizer.syncPositionWith(syncElementMock);

      $scope.show = !$scope.show;
      runDigest();
      flushDebounce();

      callCount += 1;
      synchronizer.onScroll.callCount.should.be.equal(callCount);

      $scope.$emit('rgPlaceUnder:sync');
      flushDebounce();

      callCount += 1;
      synchronizer.onScroll.callCount.should.be.equal(callCount);

      windowEventEmitter.emit('scroll');
      flushDebounce();

      callCount += 1;
      synchronizer.onScroll.callCount.should.be.equal(callCount);
    });
  });
});

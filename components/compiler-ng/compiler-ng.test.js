import 'angular';
import 'angular-mocks';
import utilModuleName from './compiler-ng';


describe('rgCompiler', function () {


  beforeEach(window.module(
    utilModuleName
  ));


  let $rootScope;
  let $scope;
  let runDigest;
  beforeEach(window.inject(function (_$rootScope_) {
    $rootScope = _$rootScope_;
    runDigest = function () {
      $rootScope.$apply();
    };

    $scope = $rootScope.$new();
  }));


  let compiler;
  beforeEach(window.inject(function (rgCompiler) {
    compiler = rgCompiler;
  }));


  it('should compile template', function () {
    $scope.text = 'Hello World';
    let compileData = null;


    compiler({
      template: '<div>{{text}}</div>'
    }).then(data => (compileData = data));
    runDigest();


    compileData.link($scope);
    runDigest();

    compileData.element[0].should.have.html($scope.text);
  });


  it('should allow pass controller', function () {
    let compileData = null;
    const text = 'Test';


    compiler({
      template: '<div>{{text}}</div>',
      controller: [
        '$scope',
        function (scope) {
          scope.text = text;
        }]
    }).then(data => (compileData = data));
    runDigest();


    compileData.link($scope);
    runDigest();

    compileData.element[0].should.have.html(text);
  });


  it('should allow use controllerAs syntaxis', function () {
    let compileData = null;
    const text = 'Test';


    compiler({
      template: '<div>{{myCtrl.text}}</div>',
      controllerAs: 'myCtrl',
      controller: function () {
        this.text = text;
      }
    }).then(data => (compileData = data));
    runDigest();


    compileData.link($scope);
    runDigest();

    compileData.element[0].should.have.html(text);
  });


  it('should allow pass local dependencies', function () {
    let compileData = null;
    const text = 'Test';


    compiler({
      template: '<div>{{text}}</div>',
      locals: {
        textLocal: text
      },
      controller: [
        '$scope',
        'textLocal', function (scope, textLocal) {
          scope.text = textLocal;
        }]
    }).then(data => (compileData = data));
    runDigest();


    compileData.link($scope);
    runDigest();

    compileData.element[0].should.have.html(text);
  });


  it('should allow pass asychronous dependencies', function () {
    let compileData = null;
    const text = 'Test';


    compiler({
      template: '<div>{{text}}</div>',
      resolve: {
        textResolve: function ($q) {
          return $q.when(text);
        }
      },
      controller: [
        '$scope',
        'textResolve', function (scope, textResolve) {
          scope.text = textResolve;
        }]
    }).then(data => (compileData = data));
    runDigest();


    compileData.link($scope);
    runDigest();

    compileData.element[0].should.have.html(text);
  });


  it('should allow use bindToController for resolve and locals', function () {
    let compileData = null;
    const text = 'Test';


    compiler({
      template: '<div>{{myCtrl.textResolve}}</div>',
      resolve: {
        textResolve: function ($q) {
          return $q.when(text);
        }
      },
      bindToController: true,
      controllerAs: 'myCtrl',
      controller: window.angular.noop
    }).then(data => (compileData = data));
    runDigest();


    compileData.link($scope);
    runDigest();

    compileData.element[0].should.have.html(text);
  });
});

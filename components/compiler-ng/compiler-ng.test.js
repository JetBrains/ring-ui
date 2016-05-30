import 'angular';
import 'angular-mocks';
import utilModuleName from './compiler-ng';


describe('rgCompiler', () => {


  beforeEach(window.module(
    utilModuleName
  ));


  let $rootScope;
  let $scope;
  let runDigest;
  beforeEach(window.inject(_$rootScope_ => {
    $rootScope = _$rootScope_;
    runDigest = () => {
      $rootScope.$apply();
    };

    $scope = $rootScope.$new();
  }));


  let compiler;
  beforeEach(window.inject(rgCompiler => {
    compiler = rgCompiler;
  }));


  it('should compile template', () => {
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


  it('should allow pass controller', () => {
    let compileData = null;
    const text = 'Test';


    compiler({
      template: '<div>{{text}}</div>',
      controller: [
        '$scope',
        scope => {
          scope.text = text;
        }]
    }).then(data => (compileData = data));
    runDigest();


    compileData.link($scope);
    runDigest();

    compileData.element[0].should.have.html(text);
  });


  it('should allow use controllerAs syntaxis', () => {
    let compileData = null;
    const text = 'Test';


    compiler({
      template: '<div>{{myCtrl.text}}</div>',
      controllerAs: 'myCtrl',
      controller() {
        this.text = text;
      }
    }).then(data => (compileData = data));
    runDigest();


    compileData.link($scope);
    runDigest();

    compileData.element[0].should.have.html(text);
  });


  it('should allow pass local dependencies', () => {
    let compileData = null;
    const text = 'Test';


    compiler({
      template: '<div>{{text}}</div>',
      locals: {
        textLocal: text
      },
      controller: [
        '$scope',
        'textLocal', (scope, textLocal) => {
          scope.text = textLocal;
        }]
    }).then(data => (compileData = data));
    runDigest();


    compileData.link($scope);
    runDigest();

    compileData.element[0].should.have.html(text);
  });


  it('should allow pass asychronous dependencies', () => {
    let compileData = null;
    const text = 'Test';


    compiler({
      template: '<div>{{text}}</div>',
      resolve: {
        textResolve($q) {
          return $q.when(text);
        }
      },
      controller: [
        '$scope',
        'textResolve', (scope, textResolve) => {
          scope.text = textResolve;
        }]
    }).then(data => (compileData = data));
    runDigest();


    compileData.link($scope);
    runDigest();

    compileData.element[0].should.have.html(text);
  });


  it('should allow use bindToController for resolve and locals', () => {
    let compileData = null;
    const text = 'Test';


    compiler({
      template: '<div>{{myCtrl.textResolve}}</div>',
      resolve: {
        textResolve($q) {
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

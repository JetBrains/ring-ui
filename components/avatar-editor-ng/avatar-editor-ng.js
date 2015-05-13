/* global angular: false */

require('button/button.scss');
require('avatar-editor/avatar-editor.scss');

require('message-bundle-ng/message-bundle-ng');
require('alert-ng/alert-ng');

angular.module('Ring.avatar-editor', ['Ring.message-bundle', 'Ring.alert']).
/**
 * <avatar-editor ng-model='entity.iconUrl' on-select='uploadFile(name, data)' default='default-picture-uri' controls='editor'></avatar-editor>
 *
 * Input to select images to be uploaded as DataURI. On-select attribute gets filename as <code>name</code>
 * and DataURIed file content as <code>data</code>.
 */
  directive('rgAvatarEditor',
    function () {
      return {
        restrict: 'E',
        scope: {
          model: '=ngModel',
          onSelect: '&',
          controls: '=?',
          'default': '@',
          ngDisabled: '='
        },
        template: require('./avatar-editor-ng.html'),
        transclude: true,
        controller: ['$scope', '$attrs', 'RingMessageBundle', 'alert', function ($scope, $attrs, RingMessageBundle, alert) {
          var fileInput;

          function setLang() {
            $scope.deleteMessage = RingMessageBundle.avatareditor_delete();
            $scope.addMessage = RingMessageBundle.avatareditor_add();
          }
          $scope.$on('gettextLanguageChanged', setLang);
          setLang();

          if ('controls' in $attrs) {
            $scope.controlled = true;
          }

          function createFileLoadListener(file) {
            return function (readEvent) {
              var data = readEvent.target.result;
              var result = $scope.onSelect({name: file.name, data: data});
              if (result && result.then) {
                result.then(function () {
                  $scope.model = data;
                });
              } else if (result !== false) {
                $scope.$apply(function () {
                  $scope.model = data;
                });
              }
            };
          }

          this.registerFileInput = function (input) {
            fileInput = input;
            fileInput.on('change', function (event) {
              var imageFileSelected = false;
              for (var i = 0; i < event.target.files.length; i++) {
                var file = event.target.files[i];
                if (file.type.indexOf('image/') === 0) {
                  imageFileSelected = true;
                  var reader = new FileReader();
                  reader.onload = createFileLoadListener(file);
                  reader.readAsDataURL(file);
                  break;
                }
              }
              if (event.target.files.length && !imageFileSelected) {
                alert.error(RingMessageBundle.avatareditor_noselected());
              }
            });
          };

          $scope.controls = {};

          $scope.controls.select = function () {
            if (!FileReader) {
              alert.error(RingMessageBundle.avatareditor_nosupport());
            } else {
              fileInput.on('click.avatar-editor', function (event) {
                event.stopPropagation();
              });
              fileInput.click();
              fileInput.off('click.avatar-editor');
            }
          };

          $scope.controls.remove = function () {
            var data = '';
            var result = $scope.onSelect({name: data, data: data});
            if (result && result.then) {
              result.then(function () {
                $scope.model = data;
              });
            } else if (result !== false) {
              $scope.model = data;
            }
          };
        }]
      };
    }
  ).
  directive('rgAvatarEditorFileInput', function () {
    return {
      restrict: 'A',
      require: '^rgAvatarEditor',
      link: function (scope, iElement, iAttrs, avatarEditorCtrl) {
        avatarEditorCtrl.registerFileInput(iElement);
      }
    };
  });

/* global angular: false */
import messageBundleNg from 'message-bundle-ng/message-bundle-ng';
import alertNg from 'alert-ng/alert-ng';
import reactNg from 'react-ng/react-ng';
import Icon from 'icon/icon';

import 'avatar-editor/avatar-editor.scss';
import 'button/button.scss';

reactNg({ Icon: Icon });

let module = angular.module('Ring.avatar-editor', [messageBundleNg, alertNg, 'Ring.react-ng']);

/**
 * @name Avatar Editor Ng
 * @description Input to select images to be uploaded as DataURI. On-select attribute gets filename as `name`
 * and DataURIed file content as `data`.
 * @example
   <example name="avatar-editor-ng">
     <file name="index.html">
       <div ng-app="test" ng-controller="testCtrl as ctrl">
         <rg-avatar-editor
         on-select="ctrl.name = name"
         ng-model="ctrl.data"></rg-avatar-editor>

         <h3>{{ ctrl.name || 'No file name' }}</h3>
         <img style="max-width: 300px; max-height: 300px;"ng-src="{{ ctrl.data }}" />
       </div>
     </file>
     <file name="index.js" webpack="true">
       require('angular');
       require('avatar-editor-ng/avatar-editor-ng');

       angular.module('test', ['Ring.avatar-editor']).controller('testCtrl', function() {
          var ctrl = this;

          ctrl.data = 'data:image/svg+xml;utf8,<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
            '<circle cx="60" cy="60" r="50" style="fill: #00cc00"/>' +
          '</svg>';
        });
     </file>
   </example>
 */
function rgAvatarEditor() {
  return {
    restrict: 'E',
    scope: {
      model: '=ngModel',
      onSelect: '&',
      'default': '@',
      ngDisabled: '='
    },
    template: require('./avatar-editor-ng.html'),
    transclude: true,
    controller: function ($scope, $attrs, RingMessageBundle, alert) {
      let fileInput;

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
        return readEvent => {
          let data = readEvent.target.result;
          let result = $scope.onSelect({name: file.name, data: data});
          if (result && result.then) {
            result.then(() => {
              $scope.model = data;
            });
          } else if (result !== false) {
            $scope.$apply(() => {
              $scope.model = data;
            });
          }
        };
      }

      this.registerFileInput = input => {
        fileInput = input;
        fileInput.addEventListener('change', e => {
          let imageFileSelected = false;
          for (let i = 0; i < e.target.files.length; i++) {
            let file = e.target.files[i];
            if (file.type.indexOf('image/') === 0) {
              imageFileSelected = true;
              let reader = new FileReader();
              reader.onload = createFileLoadListener(file);
              reader.readAsDataURL(file);
              break;
            }
          }
          if (e.target.files.length && !imageFileSelected) {
            alert.error(RingMessageBundle.avatareditor_noselected());
          }
        });
      };

      $scope.controls = {};

      function onClick(e) {
        e.stopPropagation();
      }

      $scope.controls.select = () => {
        if (!FileReader) {
          alert.error(RingMessageBundle.avatareditor_nosupport());
        } else {
          fileInput.addEventListener('click', onClick);
          fileInput.dispatchEvent(new MouseEvent('click'));
          fileInput.removeEventListener('click', onClick);
        }
      };

      $scope.controls.remove = () => {
        let data = '';
        let result = $scope.onSelect({name: data, data: data});
        if (result && result.then) {
          result.then(() => {
            $scope.model = data;
          });
        } else if (result !== false) {
          $scope.model = data;
        }
      };
    }
  };
}

function rgAvatarEditorFileInput() {
  return {
    restrict: 'A',
    require: '^rgAvatarEditor',
    link: function (scope, iElement, iAttrs, avatarEditorCtrl) {
      avatarEditorCtrl.registerFileInput(iElement[0]);
    }
  };
}

module.directive('rgAvatarEditor', rgAvatarEditor);
module.directive('rgAvatarEditorFileInput', rgAvatarEditorFileInput);

export default module.name;

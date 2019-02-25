import angular from 'angular';

import pencilIcon from '@jetbrains/icons/pencil.svg';

import messageBundleNg from '../message-bundle-ng/message-bundle-ng';
import alertService from '../alert-service/alert-service';
import IconNG from '../icon-ng/icon-ng';

import '../avatar-editor/avatar-editor.scss';

const angularModule = angular.module('Ring.avatar-editor', [messageBundleNg, IconNG]);

/**
 * @name Avatar Editor Ng
 * @tags Ring UI Language
 * @category Legacy Angular
 * @description Allows to choose images to be uploaded as Data URI. On-select attribute will receive the
 * filename as `name` and the file contents as `data`.
 * @example
   <example name="Avatar Editor Ng">
     <file name="index.html">
       <div ng-app="test" ng-strict-di ng-controller="testCtrl as ctrl">
         <rg-avatar-editor
           on-select="ctrl.name = name"
           delete-label="Clear"
           ng-model="ctrl.data"></rg-avatar-editor>

         <h3>{{ ctrl.name || 'No file name' }}</h3>
         <img style="max-width: 300px; max-height: 300px;"ng-src="{{ ctrl.data }}" />
       </div>
     </file>
     <file name="index.js" webpack="true">
       import angular from 'angular';
       import AvatarEditorNG from '@jetbrains/ring-ui/components/avatar-editor-ng/avatar-editor-ng';

       angular.module('test', [AvatarEditorNG]).controller('testCtrl', function () {
          const ctrl = this;

          ctrl.data = `data:image/svg+xml;utf8,
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="50" style="fill: #00cc00"/>
            </svg>
          `;
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
      default: '@',
      ngDisabled: '=',
      showDeleteButton: '=?',
      showAddButton: '=?',
      deleteLabel: '@',
      addMessage: '@'
    },
    template: require('./avatar-editor-ng.html'),
    transclude: true,
    controller: [
      '$scope', '$attrs', 'RingMessageBundle',
      function controller($scope, $attrs, RingMessageBundle) {
        let fileInput;
        $scope.editIcon = pencilIcon;
        $scope.showAddButton = 'showAddButton' in $scope ? $scope.showAddButton : true;
        $scope.showDeleteButton = 'showDeleteButton' in $scope ? $scope.showDeleteButton : true;

        if ('controls' in $attrs) {
          $scope.controlled = true;
        }

        function createFileLoadListener(file) {
          return readEvent => {
            const data = readEvent.target.result;
            const result = $scope.onSelect({name: file.name, data});
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
              const file = e.target.files[i];
              if (file.type.indexOf('image/') === 0) {
                imageFileSelected = true;
                const reader = new FileReader();
                reader.onload = createFileLoadListener(file);
                reader.readAsDataURL(file);
                break;
              }
            }
            if (e.target.files.length && !imageFileSelected) {
              alertService.error(RingMessageBundle.avatareditor_noselected());
            }
          });
        };

        $scope.controls = {};

        function onClick(e) {
          e.stopPropagation();
        }

        $scope.controls.select = () => {
          if (!FileReader) {
            alertService.error(RingMessageBundle.avatareditor_nosupport());
          } else {
            fileInput.addEventListener('click', onClick);
            fileInput.dispatchEvent(new MouseEvent('click'));
            fileInput.removeEventListener('click', onClick);
          }
        };

        $scope.controls.remove = () => {
          const data = '';
          const result = $scope.onSelect({name: data, data});
          if (result && result.then) {
            result.then(() => {
              $scope.model = data;
            });
          } else if (result !== false) {
            $scope.model = data;
          }
        };

        $scope.getDeleteLabel = () => (
          $scope.deleteLabel || RingMessageBundle.avatareditor_delete()
        );

        $scope.getAddMessage = () => (
          $scope.addMessage || RingMessageBundle.avatareditor_add()
        );
      }
    ]
  };
}

function rgAvatarEditorFileInput() {
  return {
    restrict: 'A',
    require: '^rgAvatarEditor',
    link: function link(scope, iElement, iAttrs, avatarEditorCtrl) {
      avatarEditorCtrl.registerFileInput(iElement[0]);
    }
  };
}

angularModule.directive('rgAvatarEditor', rgAvatarEditor);
angularModule.directive('rgAvatarEditorFileInput', rgAvatarEditorFileInput);

export default angularModule.name;

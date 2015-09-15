/* global angular: false */
import 'dom4';
import shortcuts from 'shortcuts/shortcuts';
import $ from 'jquery';

import 'dialog/dialog.scss';

let dialogMixin = {
  /**
   * Shows dialog.
   * @param config Object with following fields: <ul>
   *   <li>title — [required String] title of the dialog</li>
   *   <li>content — [required String] path to an angularJS template that will be rendered as a body of the dialog</li>
   *   <li>data — [optional Object, default {}] an object that is copied to the scope of the dialog content under the name 'data'</li>
   *   <li>buttons — [required Array] collection of objects representing buttons in the footer of the dialog.
   *   Following fields are available for every button: <ul>
   *     <li>label — [required String] a text on a button</li>
   *     <li>default — [optional Boolean, default false] if true then button is highlighted as default and acts on Enter key press</li>
   *     <li>close — [optional Boolean, default true] if true then click on the button closes the dialog unless action of the button returned false</li>
   *     <li>action — [optional function(data, button, errorCallback(errorMessage))] is executed on button click. If returns false then window shouldn't be closed</li>
   *     <li>Also any field may be added to the button and later read in action function</li>
   *   </ul></li>
   * </ul>
   *
   */
  show: function (config) {
    let dialogScope = this.dialogScope;

    if (!dialogScope) {
      if (this.fallbackDialog) {
        return this.fallbackDialog.show(config);
      } else {
        this.$log.error('No dialog directive is found');
        return this.$q.reject();
      }
    }

    if (dialogScope.active) {
      this.reset();
    }

    // Clear dialog errors
    dialogScope.error = null;
    if (dialogScope.dialogForm) {
      dialogScope.dialogForm.$setPristine();
    }

    if (config) {
      dialogScope.title = config.title;
      dialogScope.buttons = config.buttons;
      dialogScope.data = config.data || {};
      dialogScope.wideDialog = config.wideDialog;
      dialogScope.content = config.content;
      dialogScope.description = config.description && config.description.split('\n') || [];
    }

    dialogScope.currentShortcutsScope = shortcuts.getScope();
    dialogScope.DIALOG_NAMESPACE = this.DIALOG_NAMESPACE;
    shortcuts.setScope(this.DIALOG_NAMESPACE);

    dialogScope.active = true;
    dialogScope.promise = this.$q.defer();

    return dialogScope.promise.promise;
  },

  /**
   * Hides dialog
   */
  hide: function () {
    let dialogScope = this.dialogScope;

    if (!dialogScope) {
      if (this.fallbackDialog) {
        return this.fallbackDialog.hide();
      }
    } else {
      dialogScope.active = false;
      dialogScope.content = '';

      delete dialogScope.DIALOG_NAMESPACE;

      if (shortcuts.getScope().pop() === this.DIALOG_NAMESPACE) {
        shortcuts.setScope(dialogScope.currentShortcutsScope);
      }
    }
  },

  done: function () {
    this.dialogScope.promise.resolve();
    this.hide();
  },

  reset: function () {
    this.dialogScope.promise.reject();
    this.hide();
  },

  register: function (scope) {
    this.dialogScope = scope;

    scope.$watch('active', () => {
      if (scope.active) {
        shortcuts.bindMap({
          esc: () => {
            scope.reset();
            scope.$apply();
          },
          enter: this.applyDefaultHandler(false),
          'mod+enter': this.applyDefaultHandler(true)
        }, { scope: scope.DIALOG_NAMESPACE });
      }
    });
  },

  unregister: function () {
    delete this.dialogScope;
  },

  applyDefaultHandler: function (isTextAreaShortcut) {
    let scope = this.dialogScope;

    return event => {
      if (event.target.matches('textarea') !== isTextAreaShortcut || event.target.matches('button')) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      if (scope.dialogForm.$valid) {
        scope.buttons.every(button => {
          if (button['default']) {
            scope.action(button);
            scope.$apply();
            return false;
          }
        });
      }
    };
  }
};

let ringDialogModule = angular.module('Ring.dialog', []);

ringDialogModule.directive('rgDialog', function ($timeout) {
  return {
    restrict: 'AE',
    scope: {
      inSidebar: '@?',
      active: '=?'
    },
    replace: true,
    template: require('./dialog-ng.html'),
    controller: ['$scope', 'dialog', 'dialogInSidebar', function ($scope, popupDialog, sidebarDialog) {
      let dialog = $scope.inSidebar ? sidebarDialog : popupDialog;

      $scope.$on('$routeChangeSuccess', ::dialog.hide);
      $scope.$on('$routeUpdate', ::dialog.hide);

      $scope.done = () => {
        $scope.resetPosition();
        dialog.done();
      };

      $scope.reset = () => {
        $scope.resetPosition();
        dialog.reset();
      }

      $scope.action = button => {
        let dontClose = false;

        if (button.action) {
          dontClose = button.action($scope.data, button, errorMessage => {
            $scope.error = errorMessage;
          }, $scope.dialogForm) === false;
        }

        if (!dontClose && (button.close !== false)) {
          $scope.reset();
        }
      };

      this.setTitle = title => $scope.title = title;

      dialog.register($scope);

      $scope.$on('$destroy', () => {
        dialog.unregister();
      });
    }],
    link: function (scope, iElement) {
      let iDocument = $(document);
      let iDialogContainer = iElement.find('.ring-dialog__container');
      let iDialogTitle = iElement.find('.ring-dialog__header__title');
      let pageHeight = null;
      let pageWidth = null;

      scope.resetPosition = () => {
        iDialogContainer.attr('style', null);
      };

      function setPosition(top, left) {
        pageHeight = window.innerHeight;
        pageWidth = window.innerWidth;

        if (top === undefined) {
          top = parseInt(iDialogContainer.css('top'), 10);
        }
        if (left === undefined) {
          left = parseInt(iDialogContainer.css('left'), 10);
        }

        let boxShadowSize = 30;
        let maxTop = pageHeight - iDialogContainer.height() - boxShadowSize;
        let maxLeft = pageWidth - iDialogContainer.width() - boxShadowSize;
        if (top > maxTop) {
          top = maxTop;
        }
        if (top < boxShadowSize) {
          top = boxShadowSize;
        }
        if (left > maxLeft) {
          left = maxLeft;
        }
        if (left < boxShadowSize) {
          left = boxShadowSize;
        }

        iDialogContainer.css({
          'top': top + 'px',
          'left': left + 'px',
          'margin': '0'
        });
      }

      iDialogTitle.on('mousedown', mousedownEvent => {
        let titlePos = {
          top: mousedownEvent.clientY,
          left: mousedownEvent.clientX
        };

        let offsetContainer = iDialogContainer.offset();
        offsetContainer.top = offsetContainer.top - iDocument.scrollTop();

        // Duct tape for all Ring 1.0 dropdown components inside
        iElement.trigger('ring.popup-close');

        iDocument.
          on('mousemove.' + scope.DIALOG_NAMESPACE, mousemoveEvent => {
            let top = (offsetContainer.top - (titlePos.top - mousemoveEvent.clientY));
            let left = (offsetContainer.left - (titlePos.left - mousemoveEvent.clientX));
            setPosition(top, left);
          }).
          one('mouseup.' + scope.DIALOG_NAMESPACE, () => {
            iDocument.off('mousemove.' + scope.DIALOG_NAMESPACE);
          });

        window.addEventListener('resize', () => setPosition());
      });

      // Focus first input
      function focusFirst() {
        iElement.find(':input,[contentEditable=true]').filter(':visible').first().focus();
      }

      iDocument.on('focusin.' + scope.DIALOG_NAMESPACE, e => {
        if (!iElement[0].contains(e.target) && e.target.classList.contains('ring-popup')) {
          e.preventDefault();
          focusFirst();
        }
      });

      scope.$on('$includeContentLoaded', () => {
        $timeout(focusFirst);
      });

      scope.$on('$destroy', () => {
        iDocument.off('.' + scope.DIALOG_NAMESPACE);
      });
    }
  };
});

ringDialogModule.directive('rgDialogTitle', function () {
  return {
    require: '^rgDialog',
    link: function (scope, iElement, iAttrs, dialogCtrl) {
      dialogCtrl.setTitle(iAttrs.rgDialogTitle);
    }
  };
});

ringDialogModule.service('dialog', function ($log, $q) {
  return {
    DIALOG_NAMESPACE: 'ring-dialog',
    $log: $log,
    $q: $q
  };
});

ringDialogModule.service('dialogInSidebar', function ($log, $q, dialog) {
  return {
    fallbackDialog: dialog,
    DIALOG_NAMESPACE: 'ring-dialog-in-sidebar',
    $log: $log,
    $q: $q
  };
});

ringDialogModule.config($provide => {
  $provide.decorator('dialog', $delegate => {
    return angular.extend($delegate, dialogMixin);
  });
});

ringDialogModule.config($provide => {
  $provide.decorator('dialogInSidebar', $delegate => {
    return angular.extend($delegate, dialogMixin);
  });
});

export default ringDialogModule.name;

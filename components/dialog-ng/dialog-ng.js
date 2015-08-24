/* global angular: false */
require('dom4');
var shortcuts = require('shortcuts/shortcuts');
var $ = require('jquery');

require('dialog/dialog.scss');

var dialogMixin = {
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
  'show': function (config) {
    var dialogScope = this.dialogScope;

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
  'hide': function () {
    var dialogScope = this.dialogScope;

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

  'done': function () {
    this.dialogScope.promise.resolve();
    this.hide();
  },

  'reset': function () {
    this.dialogScope.promise.reject();
    this.hide();
  },

  'register': function (scope) {
    this.dialogScope = scope;

    scope.$watch('active', function () {
      if (scope.active) {
        shortcuts.bindMap({
          'esc': function () {
            scope.reset();
            scope.$apply();
          },
          'enter': this.applyDefaultHandler(false),
          'mod+enter': this.applyDefaultHandler(true)
        }, { scope: scope.DIALOG_NAMESPACE });
      }
    }.bind(this));
  },

  'unregister': function () {
    delete this.dialogScope;
  },

  applyDefaultHandler: function (isTextAreaShortcut) {
    var scope = this.dialogScope;

    return function (event) {
      if (event.target.matches('textarea') !== isTextAreaShortcut || event.target.matches('button')) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      if (scope.dialogForm.$valid) {
        scope.buttons.every(function (button) {
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

angular.module('Ring.dialog', []).
  directive('rgDialog', ['$timeout', function ($timeout) {
    return {
      'restrict': 'AE',
      'scope': {
        'inSidebar': '@?',
        'active': '=?'
      },
      'replace': true,
      'template': require('./dialog-ng.html'),
      'controller': ['$scope', 'dialog', 'dialogInSidebar', function ($scope, popupDialog, sidebarDialog) {
        var dialog = $scope.inSidebar ? sidebarDialog : popupDialog;

        $scope.$on('$routeChangeSuccess', dialog.hide);
        $scope.$on('$routeUpdate', dialog.hide);

        $scope.done = function () {
          $scope.resetPosition();
          dialog.done();
        };

        $scope.reset = function () {
          $scope.resetPosition();
          dialog.reset();
        };

        $scope.action = function (button) {
          var dontClose = false;
          if (button.action) {
            dontClose = button.action($scope.data, button, function (errorMessage) {
              $scope.error = errorMessage;
            }, $scope.dialogForm) === false;
          }
          if (!dontClose && (button.close !== false)) {
            $scope.reset();
          }
        };

        this.setTitle = function (title) {
          $scope.title = title;
        };

        dialog.register($scope);
        $scope.$on('$destroy', function() {
          dialog.unregister();
        });
      }],
      'link': function (scope, iElement) {
        var iDocument = $(document);
        var iWindow = $(window);
        var iDialogContainer = iElement.find('.ring-dialog__container');
        var iDialogTitle = iElement.find('.ring-dialog__header__title');
        var pageHeight = null;
        var pageWidth = null;

        scope.resetPosition = function() {
          iDialogContainer.attr('style', null);
        };

        function setPosition(top, left) {
          pageHeight = iWindow.outerHeight();
          pageWidth = iWindow.outerWidth();

          if (top === undefined) {
            top = parseInt(iDialogContainer.css('top'), 10);
          }
          if (left === undefined) {
            left = parseInt(iDialogContainer.css('left'), 10);
          }

          var boxShadowSize = 30;
          var maxTop = pageHeight - iDialogContainer.height() - boxShadowSize;
          var maxLeft = pageWidth - iDialogContainer.width() - boxShadowSize;
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

        iDialogTitle.on('mousedown', function (mousedownEvent) {
          var titlePos = {
            top: mousedownEvent.clientY,
            left: mousedownEvent.clientX
          };
          var offsetContainer = iDialogContainer.offset();
          offsetContainer.top = offsetContainer.top - iDocument.scrollTop();

          // Duct tape for all Ring 1.0 dropdown components inside
          iElement.trigger('ring.popup-close');

          iDocument.
            on('mousemove.' + scope.DIALOG_NAMESPACE, function (mousemoveEvent) {
              var top = (offsetContainer.top - (titlePos.top - mousemoveEvent.clientY));
              var left = (offsetContainer.left - (titlePos.left - mousemoveEvent.clientX));

              setPosition(top, left);
            }).
            one('mouseup.' + scope.DIALOG_NAMESPACE, function () {
              iDocument.off('mousemove.' + scope.DIALOG_NAMESPACE);
            });

          window.addEventListener('resize', function() {
            setPosition();
          });
        });

        // Focus first input
        var focusFirst = function () {
          iElement.find(':input,[contentEditable=true]').filter(':visible').first().focus();
        };

        iDocument.on('focusin.' + scope.DIALOG_NAMESPACE, function (e) {
          if (!iElement[0].contains(e.target) && e.target.classList.contains('ring-popup')) {
            e.preventDefault();
            focusFirst();
          }
        });

        scope.$on('$includeContentLoaded', function () {
          $timeout(focusFirst);
        });

        scope.$on('$destroy', function () {
          iDocument.off('.' + scope.DIALOG_NAMESPACE);
        });
      }
    };
  }]).
  directive('rgDialogTitle', function () {
    return {
      'require': '^rgDialog',
      'link': function (scope, iElement, iAttrs, dialogCtrl) {
        dialogCtrl.setTitle(iAttrs.rgDialogTitle);
      }
    };
  }).
  service('dialog', function ($log, $q) {
    return {
      DIALOG_NAMESPACE: 'ring-dialog',
      $log: $log,
      $q: $q
    };
  }).
  service('dialogInSidebar', function ($log, $q, dialog) {
    return {
      fallbackDialog: dialog,
      DIALOG_NAMESPACE: 'ring-dialog-in-sidebar',
      $log: $log,
      $q: $q
    };
  }).
  config(function ($provide) {
    $provide.decorator('dialog', function ($delegate) {
      return angular.extend($delegate, dialogMixin);
    });
  }).
  config(function ($provide) {
    $provide.decorator('dialogInSidebar', function ($delegate) {
      return angular.extend($delegate, dialogMixin);
    });
  });

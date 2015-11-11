/* global angular: false */
import 'dom4';
import {getStyles, getRect} from '../dom/dom';
import shortcuts from '../shortcuts/shortcuts';

import '../dialog/dialog.scss';

const module = angular.module('Ring.dialog', []);

class DialogController {
  static BODY_MODAL_CLASS = 'ring-dialog-modal';

  constructor($scope, $q, dialog, dialogInSidebar) {
    const dialogService = this.inSidebar ? dialogInSidebar : dialog;

    this.$scope = $scope;
    this.$q = $q;
    this.dialogService = dialogService;

    $q((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });

    $scope.$on('$routeChangeSuccess', ::this.hide);
    $scope.$on('$routeUpdate', ::this.hide);
    $scope.$on('$destroy', ::dialogService.unregister);

    $scope.$watch(() => this.active, () => {
      if (this.active) {
        shortcuts.bindMap({
          esc: () => {
            this.reset();
            $scope.$apply();
          },
          enter: ::this.applyDefaultHandler(false),
          'mod+enter': ::this.applyDefaultHandler(true)
        }, {
          scope: this.DIALOG_NAMESPACE
        });
      } else {
        this.reset();
      }
    });

    dialogService.register(this);
  }

  setTitle(title) {
    this.title = title;
  }

  show(config) {
    if (!this.inSidebar) {
      document.body.classList.add(this.constructor.BODY_MODAL_CLASS);
    }

    if (this.active) {
      this.reset();
    }

    // Clear dialog errors
    this.error = null;
    if (this.dialogForm) {
      this.dialogForm.$setPristine();
    }

    if (config) {
      this.title = config.title;
      this.buttons = config.buttons;
      this.data = config.data || {};
      this.wideDialog = config.wideDialog;
      this.content = config.content;
      this.description = config.description && config.description.split('\n') || [];
    }

    this.currentShortcutsScope = shortcuts.getScope();
    this.DIALOG_NAMESPACE = this.dialogService.DIALOG_NAMESPACE;
    shortcuts.setScope(this.dialogService.DIALOG_NAMESPACE);

    this.active = true;

    this.$scope.$broadcast('dialog.show');

    return this.$q((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  update(config) {
    Object.assign(this.data, config.data);
  }

  hide() {
    if (!this.inSidebar) {
      document.body.classList.remove(this.constructor.BODY_MODAL_CLASS);
    }

    this.active = false;
    this.content = '';

    Reflect.deleteProperty(this, 'DIALOG_NAMESPACE');

    if (shortcuts.getScope().pop() === this.dialogService.DIALOG_NAMESPACE) {
      shortcuts.setScope(this.currentShortcutsScope);
    }
  }

  done() {
    this.resetPosition();
    this.resolve();
    this.hide();
  }

  reset() {
    this.resetPosition();
    this.reject();
    this.hide();
  }

  action(button) {
    let dontClose = false;

    if (button.action) {
      dontClose = button.action(this.data, button, errorMessage => {
        this.error = errorMessage;
      }, this.dialogForm) === false;
    }

    if (!dontClose && (button.close !== false)) {
      this.reset();
    }
  }

  applyDefaultHandler(isTextAreaShortcut) {
    return event => {
      if (event.target.matches('textarea') !== isTextAreaShortcut || event.target.matches('button')) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      if (this.dialogForm.$valid) {
        this.buttons.every(button => {
          if (button.default) {
            this.action(button);
            this.$scope.$apply();
            return false;
          }
        });
      }
    };
  }
}

class DialogService {
  DIALOG_NAMESPACE = 'ring-dialog';
  fallbackDialog = null;

  constructor($log) {
    this.$log = $log;

    // Binding proxy methods to a service instance
    ['show', 'hide', 'update', 'done', 'reset'].forEach(key => {
      this[key] = function (...args) {
        if (this.ctrl) {
          return this.ctrl[key](...args);
        } else if (this.fallbackDialog) {
          return this.fallbackDialog[key](...args);
        } else {
          this.$log.error('No dialog directive is found');
        }
      }.bind(this);
    });
  }

  register(ctrl) {
    this.ctrl = ctrl;
  }

  unregister() {
    Reflect.deleteProperty(this, 'ctrl');
  }
}

class DialogInSidebarService extends DialogService {
  DIALOG_NAMESPACE = 'ring-dialog-in-sidebar';

  constructor($log, dialog) {
    super($log);
    this.fallbackDialog = dialog;
  }
}

function rgDialogDirective($timeout) {
  function link(scope, iElement, iAttrs, dialogCtrl) {
    const node = iElement[0];
    const dialogContainer = node.query('.ring-dialog__container');
    const dialogTitle = node.query('.ring-dialog__header__title');

    let pageHeight = null;
    let pageWidth = null;

    function setPosition(top, left) {
      pageHeight = window.innerHeight;
      pageWidth = window.innerWidth;

      if (top === undefined) {
        top = parseInt(getStyles(dialogContainer).top, 10);
      }

      if (left === undefined) {
        left = parseInt(getStyles(dialogContainer).left, 10);
      }

      const clearance = 10;
      const maxTop = pageHeight - dialogContainer.clientHeight - clearance;
      const maxLeft = pageWidth - dialogContainer.clientWidth - clearance;

      if (top > maxTop) {
        top = maxTop;
      }

      if (top < clearance) {
        top = clearance;
      }

      if (left > maxLeft) {
        left = maxLeft;
      }

      if (left < clearance) {
        left = clearance;
      }

      Object.assign(dialogContainer.style, {
        top: top + 'px',
        left: left + 'px',
        margin: '0'
      });
    }

    let titlePos = {};
    let offsetContainer = {};

    // Focus first input
    function focusFirst() {
      const controls = node.queryAll('input,select,textarea,*[contentEditable=true]').filter(inputNode => getStyles(inputNode).display !== 'none');
      if (controls.length) {
        controls[0].focus();
      }
    }

    function onMousemove(e) {
      e.preventDefault();
      const top = offsetContainer.top - titlePos.top + e.clientY;
      const left = offsetContainer.left - titlePos.left + e.clientX;
      setPosition(top, left);
    }

    function onMouseup() {
      titlePos = {};
      offsetContainer = {};
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
      window.removeEventListener('resize', setPosition);
    }

    function onMousedown(e) {
      titlePos = {
        top: e.clientY,
        left: e.clientX
      };

      offsetContainer = getRect(dialogContainer);

      // Duct tape for all Ring 1.0 dropdown components inside
      node.dispatchEvent(new CustomEvent('ring.popup-close'));

      document.addEventListener('mousemove', onMousemove);
      document.addEventListener('mouseup', onMouseup);
      window.addEventListener('resize', setPosition);
    }

    function onFocusin(e) {
      if (!node.contains(e.target) && e.target.classList.contains('ring-popup')) {
        e.preventDefault();
        focusFirst();
      }
    }

    dialogCtrl.resetPosition = () => dialogContainer.removeAttribute('style');

    dialogTitle.addEventListener('mousedown', onMousedown);
    document.addEventListener('focusin', onFocusin);
    scope.$on('$includeContentLoaded', () => $timeout(focusFirst));

    scope.$on('$destroy', () => {
      dialogTitle.removeEventListener('mousedown', onMousedown);
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
      document.removeEventListener('focusin', onFocusin);
      window.removeEventListener('resize', setPosition);
    });
  }

  return {
    scope: {},
    controller: DialogController,
    bindToController: {
      inSidebar: '@?',
      active: '=?'
    },
    replace: true,
    template: require('./dialog-ng.html'),
    controllerAs: 'dialog',
    link: link
  };
}

function rgDialogTitleDirective() {
  function link(scope, iElement, iAttrs, dialogCtrl) {
    dialogCtrl.setTitle(scope.title);
  }

  return {
    scope: {
      title: '@rgDialogTitle'
    },
    require: '^rgDialog',
    link: link
  };
}

function rgDialogContentDirective($compile) {
  return {
    link: function (scope, iElement) {
      function includeNode() {
        const node = document.createElement('ng-include');
        node.setAttribute('src', 'dialog.content');
        return node;
      }

      let includeScope;
      scope.$on('dialog.show', () => {
        const element = iElement[0];

        if (includeScope) {
          includeScope.$destroy();
          while (element.childNodes.length) {
            element.removeChild(element.childNodes[0]);
          }
        }

        const newInclude = includeNode();
        element.appendChild(newInclude);
        includeScope = scope.$new();
        $compile(angular.element(newInclude))(includeScope);
      });
    }
  };
}

module.directive('rgDialog', rgDialogDirective);
module.directive('rgDialogTitle', rgDialogTitleDirective);
module.directive('rgDialogContent', rgDialogContentDirective);
module.service('dialog', DialogService);
module.service('dialogInSidebar', DialogInSidebarService);

export default module.name;

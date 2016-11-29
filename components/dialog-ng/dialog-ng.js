import 'dom4';

import {getStyles, getRect} from '../dom/dom';
import RingAngularComponent from '../ring-angular-component/ring-angular-component';
import shortcuts from '../shortcuts/shortcuts';
import RingButton from '../button-ng/button-ng';
import PromisedClickNg from '../promised-click-ng/promised-click-ng';
import rgCompilerModuleName from '../compiler-ng/compiler-ng';
import ScrollPreventer from '../dialog/dialog__body-scroll-preventer';

import '../button-legacy/button-legacy.scss';
import './dialog-ng.scss';

/**
 * @name Dialog Ng
 * @category Angular Components
 * @description Provides an Angular wrapper for Dialog.
 * @example-file ./dialog-ng.examples.html
 */
/* global angular: false */
const angularModule = angular.module('Ring.dialog', [RingButton, PromisedClickNg, rgCompilerModuleName]);

class DialogController extends RingAngularComponent {
  static $inject = ['$scope', '$q', 'dialog', 'dialogInSidebar', '$compile', '$injector', '$controller', 'rgCompiler'];

  constructor(...args) {
    super(...args);

    const {dialog, dialogInSidebar, $q, $scope} = this.$inject;
    const dialogService = this.inSidebar ? dialogInSidebar : dialog;

    this.dialogService = dialogService;
    this.previousBodyWidth = null;

    $q((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });

    $scope.$on('$routeChangeSuccess', ::this.hide);
    $scope.$on('$routeUpdate', ::this.hide);
    $scope.$on('$destroy', ::dialogService.unregister);

    $scope.$watch(() => this.active, () => {
      if (this.active) {
        shortcuts.bindMap(this.getShortcuts(), {
          scope: this.DIALOG_NAMESPACE
        });
      } else {
        this.reset();
      }
    });

    dialogService.register(this);
  }

  getShortcuts() {
    const defaultEscHandler = function () {
      this.active = false;
      this.$inject.$scope.$apply();
    }.bind(this);

    const dialogShortcuts = {
      esc: defaultEscHandler,
      enter: ::this.applyDefaultHandler(false),
      'mod+enter': ::this.applyDefaultHandler(true)
    };

    angular.extend(dialogShortcuts, this.shortcuts);

    if (this.shortcuts && this.shortcuts.esc) {
      /**
       * Merge ESC handler
       * @type {Function} {dialogShortcuts.esc}
       */
      const customHandler = dialogShortcuts.esc;
      dialogShortcuts.esc = function () {
        const result = customHandler();
        defaultEscHandler();
        return result;
      };
    }

    return dialogShortcuts;
  }

  setTitle(title) {
    this.title = title;
  }

  compileTemplate() {
    if (this.config.data) {
      const element = angular.element(this.template);

      return {
        element,
        link: this.$inject.$compile(element)
      };
    }

    return this.$inject.rgCompiler(this.config).catch(error => {
      this.reject(error);
      return this.$inject.$q.reject(error);
    });
  }

  show(config) {
    const {$q, $scope} = this.$inject;

    if (!this.inSidebar) {
      ScrollPreventer.prevent();
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
      this.autoWidth = config.autoWidth;
      this.cssClass = config.cssClass || '';

      this.shortcuts = config.shortcuts;

      this.content = config.content;
      this.template = config.template;

      this.config = config;

      this.description = config.description && config.description.split('\n') || [];
      this.closeOnClick = config.closeOnClick;

      // Backward compatibility with existing templates which use data directly from scope
      $scope.data = this.data;
    }

    this.currentShortcutsScope = shortcuts.getScope();
    this.DIALOG_NAMESPACE = this.dialogService.DIALOG_NAMESPACE;
    shortcuts.setScope(this.dialogService.DIALOG_NAMESPACE);

    this.active = true;

    $scope.$broadcast('dialog.show');

    return $q((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  update(config = {}) {
    Object.assign(this.data, config.data);
    Object.assign(this.buttons, config.buttons);

  }

  hide() {
    if (!this.inSidebar) {
      ScrollPreventer.reset();
    }

    this.active = false;
    this.content = '';

    Reflect.deleteProperty(this, 'DIALOG_NAMESPACE');

    if (shortcuts.indexOfScope(this.dialogService.DIALOG_NAMESPACE) > -1) {
      shortcuts.setScope(this.currentShortcutsScope);
    }

    this._resetFormState();
    this.$inject.$scope.$broadcast('dialog.hide');
  }

  _resetFormState() {
    const dialogForm = this.dialogForm;
    if (!dialogForm) {
      return;
    }

    dialogForm.$setPristine();
    dialogForm.$setUntouched();
    dialogForm.$valid = true;
    dialogForm.$invalid = false;
    dialogForm.$error = {};
  }

  done(result) {
    this.resetPosition();
    this.resolve(result);
    this.hide();
  }

  reset() {
    this.resetPosition();
    this.reject();
    this.hide();
  }

  action(button) {
    if (button.inProgress) {
      return undefined;
    }

    if (button.action) {
      const actionResult = button.action(this.data, button, errorMessage => {
        this.error = errorMessage;
      }, this.dialogForm, this.buttons);

      button.inProgress = true;

      return this.$inject.$q.resolve(actionResult).
        then(res => {
          const dontClose = res === false;

          if (!dontClose && (button.close !== false)) {
            this.done(res);
          }
        }).
        catch(errorMessage => {
          this.error = errorMessage;
        }).
        finally(() => {
          button.inProgress = false;
        });
    } else if (button.close !== false) {
      this.reset();
    }

    return undefined;
  }

  applyDefaultHandler(isTextAreaShortcut) {
    return event => {
      if (event.target.matches('textarea') !== isTextAreaShortcut || event.target.matches('button')) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      if (this.dialogForm.$valid) {
        (this.buttons || []).every(button => {
          if (button.default) {
            this.action(button);
            this.$inject.$scope.$apply();
            return false;
          }

          return undefined;
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
          return undefined;
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

    // Left for backward compatibility with existing templates that use data directly from scope
    scope.dialogForm = dialogCtrl.dialogForm;

    let pageHeight = null;
    let pageWidth = null;

    function setPosition(eventTop, eventLeft) {
      pageHeight = window.innerHeight;
      pageWidth = window.innerWidth;

      let top;
      if (eventTop === undefined) {
        top = parseInt(getStyles(dialogContainer).top, 10);
      } else {
        top = eventTop;
      }

      let left;
      if (eventLeft === undefined) {
        left = parseInt(getStyles(dialogContainer).left, 10);
      } else {
        left = eventLeft;
      }

      const clearance = 10;
      const maxTop = pageHeight - dialogContainer.offsetHeight - clearance;
      const maxLeft = pageWidth - dialogContainer.offsetWidth - clearance;

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
        top: `${top}px`,
        left: `${left}px`,
        margin: '0'
      });
    }

    let titlePos = {};
    let offsetContainer = {};

    // Focus first input
    function focusFirst() {
      const controls = node.queryAll('input,select,button,textarea,*[contentEditable=true]').
        filter(inputNode => getStyles(inputNode).display !== 'none');
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
    scope.$on('rgDialogContentLoaded', () => $timeout(focusFirst));

    // Backward compatibility for youtrack (if they are using "content" property)
    // which is actually ng-inlude with $includeContentLoaded event in the end
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
    link
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
    link
  };
}

function rgDialogContentDirective($compile, $q) {
  return {
    link(scope, iElement) {
      const element = iElement[0];
      let contentScope;

      function createIncludeNode() {
        const node = document.createElement('ng-include');
        node.setAttribute('src', 'dialog.content');

        return node;
      }

      function isOldDataAPI() {
        return scope.dialog.config.data;
      }

      function compileContent() {
        contentScope = scope.$new();

        if (angular.isDefined(scope.dialog.content)) {
          const templateNode = angular.element(createIncludeNode());
          element.appendChild(templateNode[0]);
          return $compile(templateNode)(contentScope)[0];
        }

        return $q.when(scope.dialog.compileTemplate()).
          then(compiledData => {
            const templateScope = isOldDataAPI() ? contentScope : (scope.dialog.config.scope || contentScope);

            // XXX(maksimrv): We should put element to directive
            // before link because some directives (shortcuts)
            // depends from global directives (shortcuts-app)
            angular.element(element).append(compiledData.element);
            compiledData.link(templateScope);
            scope.$emit('rgDialogContentLoaded');
          });
      }

      function destroy() {
        if (contentScope) {
          contentScope.$destroy();
          while (element.childNodes.length) {
            element.removeChild(element.childNodes[0]);
          }
        }
      }

      scope.$on('dialog.hide', destroy);

      scope.$on('dialog.show', () => {
        destroy();
        compileContent();
      });
    }
  };
}

angularModule.directive('rgDialog', rgDialogDirective);
angularModule.directive('rgDialogTitle', rgDialogTitleDirective);
angularModule.directive('rgDialogContent', rgDialogContentDirective);
angularModule.service('dialog', DialogService);
angularModule.service('dialogInSidebar', DialogInSidebarService);

export default angularModule.name;

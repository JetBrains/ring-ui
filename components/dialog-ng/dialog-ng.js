import angular from 'angular';

import angularSanitize from 'angular-sanitize';

import 'dom4';
import createFocusTrap from 'focus-trap';

import {getRect, getStyles} from '../global/dom';
import RingAngularComponent from '../global/ring-angular-component';
import shortcuts from '../shortcuts/core';
import RingButton from '../button-ng/button-ng';
import PromisedClickNg from '../promised-click-ng/promised-click-ng';
import rgCompilerModuleName from '../compiler-ng/compiler-ng';
import ScrollPreventer from '../dialog/dialog__body-scroll-preventer';
import '../form/form.scss';
import dialogStyles from '../dialog/dialog.css';
import islandStyles from '../island/island.css';

import styles from './dialog-ng.css';

/**
 * @name Dialog Ng
 */

const angularModule = angular.module(
  'Ring.dialog',
  [angularSanitize, RingButton, PromisedClickNg, rgCompilerModuleName]
);

class DialogController extends RingAngularComponent {
  static $inject = ['$scope', '$q', 'dialog', '$element', 'dialogInSidebar', '$compile',
    '$injector', '$controller', 'rgCompiler'];

  constructor(...args) {
    super(...args);

    this.styles = styles;
    this.dialogStyles = dialogStyles;
    this.islandStyles = islandStyles;

    this.$inject.$q((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  $onInit() {
    const {dialog, dialogInSidebar, $scope} = this.$inject;
    const dialogService = this.inSidebar ? dialogInSidebar : dialog;
    this.focusTrap = createFocusTrap(this.$inject.$element[0], {
      fallbackFocus: '[data-anchor="focus-trap-fallback"]',
      escapeDeactivates: false
    });

    this.dialogService = dialogService;
    this.previousBodyWidth = null;

    $scope.$on('$routeChangeSuccess', this.hide);
    $scope.$on('$routeUpdate', this.hide);
    $scope.$on('$destroy', dialogService.unregister);

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
    const defaultEscHandler = function escHandler() {
      this.active = false;
      this.focusTrap.deactivate();
      this.$inject.$scope.$apply();
    }.bind(this);

    const dialogShortcuts = {
      esc: defaultEscHandler,
      enter: this.applyDefaultHandler(false),
      'mod+enter': this.applyDefaultHandler(true)
    };

    angular.extend(dialogShortcuts, this.shortcuts);

    if (this.shortcuts && this.shortcuts.esc) {
      /**
       * Merge ESC handler
       * @type {Function} {dialogShortcuts.esc}
       */
      const customHandler = dialogShortcuts.esc;
      dialogShortcuts.esc = () => {
        const result = customHandler();
        defaultEscHandler();
        return result;
      };
    }

    return dialogShortcuts;
  }

  handleClick(event) {
    const isOverlayClicked = event.target === event.currentTarget;
    if (this.inSidebar || !this.closeOnClick || !isOverlayClicked) {
      return;
    }
    this.hide();
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
      if (config && config.trapFocus === true) {
        this.focusTrap.activate();
      }
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
      this.scrollableWrapperClassName = config.scrollableWrapperClassName;
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

  hide = () => {
    if (!this.inSidebar) {
      ScrollPreventer.reset();
    }

    this.active = false;
    this.content = '';
    this.focusTrap.deactivate();

    Reflect.deleteProperty(this, 'DIALOG_NAMESPACE');

    if (shortcuts.indexOfScope(this.dialogService.DIALOG_NAMESPACE) > -1) {
      shortcuts.setScope(this.currentShortcutsScope);
    }

    this._resetFormState();
    this.$inject.$scope.$broadcast('dialog.hide');
  };

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

  reset(result) {
    this.done(result);
  }

  getErrorMessage(errorResponse) {
    // eslint-disable-next-line camelcase
    if (errorResponse?.data?.error_description) {
      return errorResponse.data.error_description;
    }

    if (errorResponse?.data?.error) {
      return errorResponse.data.error;
    }

    return errorResponse;
  }

  getFieldErrorMessage(errorResponse) {
    if (errorResponse && errorResponse.data && errorResponse.data.error) {
      return errorResponse.data.error;
    }

    return null;
  }

  serverErrorFields = [];

  action(button) {
    if (button.inProgress) {
      return undefined;
    }

    const errorReporter = errorResponse => {
      const errorField = errorResponse && errorResponse.data && errorResponse.data.error_field;

      if (errorField && this.dialogForm[errorField]) {
        this.dialogForm[errorField].$invalid = true;
        this.dialogForm[errorField].$error[errorField] = [{
          message: this.getFieldErrorMessage(errorResponse)
        }];
        this.serverErrorFields.push(errorField);
      } else {
        this.error = this.getErrorMessage(errorResponse);
      }
    };

    if (button.action) {
      if (!button.keepServerErrors) {
        this.serverErrorFields.forEach(errorField => {
          this.dialogForm[errorField].$invalid = false;
          this.dialogForm[errorField].$error = {};
        });
        this.serverErrorFields = [];
      }

      const actionResult =
        button.action(this.data, button, errorReporter, this.dialogForm, this.buttons);

      button.inProgress = true;

      return this.$inject.$q.resolve(actionResult).
        then(res => {
          const dontClose = res === false;

          if (!dontClose && (button.close !== false)) {
            this.done(res);
          }
        }).
        catch(errorReporter).
        finally(() => {
          button.inProgress = false;
        });
    } else if (button.close !== false) {
      this.reset(false);
    }

    return undefined;
  }

  applyDefaultHandler(isTextAreaShortcut) {
    return event => {
      if (
        event.target.matches('textarea') !== isTextAreaShortcut ||
        event.target.matches('button')
      ) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      if (this.dialogForm.$valid && this.buttons) {
        for (const button of this.buttons) {
          if (button.default && !button.hidden && !button.disabled) {
            this.action(button);
            this.$inject.$scope.$apply();
            return;
          }
        }
      }
    };
  }
}

class DialogService extends RingAngularComponent {
  static $inject = ['$log'];

  DIALOG_NAMESPACE = 'ring-dialog';
  fallbackDialog = null;

  constructor(...constrArgs) {
    super(...constrArgs);

    // Binding proxy methods to a service instance
    ['show', 'hide', 'update', 'done', 'reset'].forEach(key => {
      this[key] = function methodWrapper(...args) {
        if (this.ctrl) {
          return this.ctrl[key](...args);
        } else if (this.fallbackDialog) {
          return this.fallbackDialog[key](...args);
        } else {
          this.$inject.$log.error('No dialog directive is found');
          return undefined;
        }
      }.bind(this);
    });
  }

  register(ctrl) {
    this.ctrl = ctrl;
  }

  unregister = () => {
    Reflect.deleteProperty(this, 'ctrl');
  }
}

class DialogInSidebarService extends DialogService {
  static $inject = [...DialogService.$inject, 'dialog'];

  DIALOG_NAMESPACE = 'ring-dialog-in-sidebar';

  constructor(...args) {
    super(...args);
    this.fallbackDialog = this.$inject.dialog;
  }
}

function rgDialogDirective($timeout) {
  function link(scope, iElement, iAttrs, dialogCtrl) {
    const node = iElement[0];
    const dialogContainer = node.querySelector('*[data-anchor=dialog-container]');
    const dialogHeader = node.querySelector('*[data-anchor=dialog-header]');
    const dialogCustomFooter = node.querySelector('*[data-anchor=dialog-custom-footer-container]');

    // Left for backward compatibility with existing templates that use data directly from scope
    scope.dialogForm = dialogCtrl.dialogForm;

    function setPosition(top, left) {
      Object.assign(dialogContainer.style, {
        top: `${top}px`,
        left: `${left}px`
      });
    }

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

      const pageHeight = window.innerHeight;
      const pageWidth = window.innerWidth;
      const clearance = 10;
      const maxTop = pageHeight - clearance;
      const maxLeft = pageWidth - clearance;

      const newTop = getRect(dialogHeader).top + e.movementY;
      const newLeft = getRect(dialogHeader).left + e.movementX;

      if (newTop > maxTop || newTop < clearance) {
        return;
      }

      if (newLeft > maxLeft || newLeft < clearance) {
        return;
      }

      const offsetY = parseFloat(dialogContainer.style.top) || 0;
      const offsetX = parseFloat(dialogContainer.style.left) || 0;
      setPosition(offsetY + e.movementY, offsetX + e.movementX);
    }

    function onMouseup() {
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
    }

    function onMousedown() {
      if (!dialogCtrl.inSidebar) {
        // Duct tape for all Ring 1.0 dropdown components inside
        node.dispatchEvent(new CustomEvent('ring.popup-close'));

        document.addEventListener('mousemove', onMousemove);
        document.addEventListener('mouseup', onMouseup);
      }
    }

    function onFocusin(e) {
      if (!node.contains(e.target) && e.target.classList.contains('ring-popup')) {
        e.preventDefault();
        focusFirst();
      }
    }

    function setCustomFooter(customFooterElem) {
      const placeholder = angular.element(dialogCustomFooter);
      const footer = angular.element(`<div class="${this.styles.footer}"></div>`).append(customFooterElem);
      placeholder.empty();
      placeholder.append(footer);
    }

    dialogCtrl.resetPosition = () => dialogContainer.removeAttribute('style');
    dialogCtrl.setCustomFooter = setCustomFooter;

    dialogHeader.addEventListener('mousedown', onMousedown);
    document.addEventListener('focusin', onFocusin);
    scope.$on('rgDialogContentLoaded', () => $timeout(focusFirst));

    // Backward compatibility for youtrack (if they are using "content" property)
    // which is actually ng-include with $includeContentLoaded event in the end
    scope.$on('$includeContentLoaded', () => $timeout(focusFirst));

    scope.$on('dialog.hide', () => {
      angular.element(dialogCustomFooter).empty();
    });

    scope.$on('$destroy', () => {
      dialogHeader.removeEventListener('mousedown', onMousedown);
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

function rgDialogFooterDirective() {
  function link(scope, iElement, iAttrs, dialogCtrl, transclude) {
    scope.$on('rgDialogContentLoaded', () => {
      transclude(scope, clone => {
        dialogCtrl.setCustomFooter(clone);
      });
    });
  }

  return {
    require: '^rgDialog',
    transclude: true,
    link
  };
}

function rgDialogContentDirective($compile, $q) {
  return {
    link: function link(scope, iElement) {
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
            const templateScope = isOldDataAPI()
              ? contentScope
              : (scope.dialog.config.scope || contentScope);

            // XXX(maksimrv): We should put element to directive
            // before link because some directives (shortcuts)
            // depends from global directives (shortcuts-app)
            angular.element(element).append(compiledData.element);
            compiledData.link(templateScope);
            scope.$broadcast('rgDialogContentLoaded');
          }).
          catch(angular.noop);
      }

      function destroy() {
        function cleanupElement(_element) {
          while (_element.childNodes.length) {

            // XXX(maksimrv): We should use jQuery.remove method because
            // AngularJS intercepts all jqLite/jQuery's DOM destruction apis and fires $destroy event
            // on all DOM nodes being removed.
            // This can be used to clean up bindings to the DOM
            // element before it is removed.
            angular.element(_element.childNodes[0]).remove();
          }
        }

        if (contentScope) {
          contentScope.$destroy();
          cleanupElement(element);
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
angularModule.directive('rgDialogFooter', rgDialogFooterDirective);
angularModule.directive('rgDialogContent', rgDialogContentDirective);
angularModule.service('dialog', DialogService);
angularModule.service('dialogInSidebar', DialogInSidebarService);

export default angularModule.name;

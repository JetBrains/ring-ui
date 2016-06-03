/* global angular: false */
import 'dom4';
import {Inject} from 'angular-es6';
import scrollbarWidth from 'scrollbar-width';

import {getStyles, getRect} from '../dom/dom';
import shortcuts from '../shortcuts/shortcuts';
import RingButton from '../button-ng/button-ng';
import rgCompilerModuleName from '../compiler-ng/compiler-ng';

import '../button/button.scss';
import '../dialog/dialog.scss';

/**
 * @name Dialog-ng
 * @example
 <example name="Dialog">
 <file name="index.html">
 <div ng-app="Example.dialog" class="very-long-page">

   <script type="template" id="dialog-template">
     <div>
       <div class="ring-form__group">
         <label class="ring-form__label" for="dialog__key">Key</label>
         <div class="ring-form__control">
           <input id="dialog__key" class="ring-input" type="text">
         </div>
       </div>

       <div class="ring-form__group">
         <label class="ring-form__label" for="dialog__name">Name</label>
         <div class="ring-form__control">
           <input id="dialog__name" class="ring-input" type="text">
           <div class="ring-error-bubble active">Wrong value</div>
           <div class="ring-form__control__description">Description</div>
         </div>
       </div>

       <div class="ring-form__group">
         <label for="rg-select-demo" class="ring-form__label">Rg Select in Form</label>
         <div class="ring-form__control">
           <rg-select options="item.name for item in dialogExampleCtrl.arr track by item.name" id="rg-select-demo"></rg-select>
         </div>
       </div>

       <div class="ring-form__group">
         <label for="textarea-demo" class="ring-form__label">Textarea in Form</label>
         <div class="ring-form__control">
           <textarea id="textarea-demo" class="ring-input"></textarea>
         </div>
       </div>
     </div>
   </script>

   <div rg-dialog=""></div>
   <div  ng-controller="ExampleCtrl"></div>
 </file>
 <file name="style.scss">
 .custom-css-class-button-right {
        float: right;
      }
 .very-long-page {
        height: 2000px;
      }
 </file>
 <file name="index.js" webpack="true">
 require('ring-ui/components/dialog/dialog.scss');
 require('ring-ui/components/panel/panel.scss');
 require('ring-ui/components/input-size/input-size.scss');

 require('angular/angular');
 require('ring-ui/components/dialog-ng/dialog-ng'),
 require('ring-ui/components/select-ng/select-ng');

 require('./style.scss');

 angular.module('Example.dialog', ['Ring.dialog', 'Ring.select'])
 .controller('ExampleCtrl', function($q, $timeout, dialog) {
     $timeout(function () {
        dialog.show({
          cssClass: 'custom-css-class',
          title: 'Test',
          shortcuts: {
            'ctrl+enter': angular.noop
          },
          template: document.getElementById('dialog-template').innerHTML,
          controllerAs: 'dialogExampleCtrl',
          controller: 'DialogExampleCtrl',
          buttons: [
            {
              label: 'Save',
              default: true,
              action: angular.noop
            },
            {
              label: 'Cancel',
              close: true
            },
            {
              label: 'Long Action',
              cssClasses: 'ring-button_danger custom-css-class-button-right',
              action: function() {
                return $timeout(angular.noop, 2000);
              }
            }
          ]
        });
      }, 500);

     }).controller('DialogExampleCtrl', function() {
        var dialogExampleCtrl = this;
        dialogExampleCtrl.arr = [{name: 'Ada'}, {name: 'Nik'}];
      });
 </file>
 </example>
 */
const angularModule = angular.module('Ring.dialog', [RingButton, rgCompilerModuleName]);

class DialogController extends Inject {
  static $inject = ['$scope', '$q', 'dialog', 'dialogInSidebar', '$compile', '$injector', '$controller', 'rgCompiler'];

  static BODY_MODAL_CLASS = 'ring-dialog-modal';

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

  preventBodyScrolling() {
    document.body.classList.add(this.constructor.BODY_MODAL_CLASS);

    const scrollWidth = scrollbarWidth();
    const bodyHasScroll = document.body.scrollHeight > window.innerHeight;
    if (bodyHasScroll && scrollWidth > 0) {
      this.previousBodyWidth = document.body.style.width;
      document.body.style.width = `calc(100% - ${scrollWidth}px)`;
    }
  }

  resetBodyScrollPrevention() {
    document.body.classList.remove(this.constructor.BODY_MODAL_CLASS);
    if (this.previousBodyWidth !== null) {
      document.body.style.width = this.previousBodyWidth;
      this.previousBodyWidth = null;
    }
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

    return this.$inject.rgCompiler(this.config);
  }

  show(config) {
    const {$q, $scope} = this.$inject;

    if (!this.inSidebar) {
      this.preventBodyScrolling();
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

      //Fallback for backward compatibility with already exist templates which use data directly from scope
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
      this.resetBodyScrollPrevention();
    }

    this.active = false;
    this.content = '';

    Reflect.deleteProperty(this, 'DIALOG_NAMESPACE');

    if (shortcuts.indexOfScope(this.dialogService.DIALOG_NAMESPACE) > -1) {
      shortcuts.setScope(this.currentShortcutsScope);
    }

    this.$inject.$scope.$broadcast('dialog.hide');
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
    if (button.action) {
      const actionResult = button.action(this.data, button, errorMessage => {
        this.error = errorMessage;
      }, this.dialogForm);

      button.inProgress = true;

      return this.$inject.$q.resolve(actionResult).
        then(res => {
          const dontClose = res === false;

          if (!dontClose && (button.close !== false)) {
            this.reset();
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

    //Fallback for backward compatibility with already exist templates which uses data directly from scope
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

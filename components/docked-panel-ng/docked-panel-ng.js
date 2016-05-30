import debounce from 'mout/function/debounce';
import 'dom4';

import {getWindowHeight, getDocumentScrollTop} from '../dom/dom';

import './docked-panel-ng.scss';

/**
 * @name Docked panel ng
 * @description Should stick panel at the bottom of the page
 *              if it's out of the browser viewport
 * @example
 * <example name="Docked panel ng">
     <file name="index.html">
      <div ng-app='DockedPanelExample'>
        <div>
          <textarea placeholder="Add description" rows="70" cols="100"></textarea>
        </div>
        <div class="ring-panel" rg-docked-panel rg-docked-panel-class="customCssClass">
          <button class="ring-button ring-button_blue">Save</button>
          <button class="ring-button"Revert>Cancel</button>
        </div>
        <br/>
        <div>
          <textarea placeholder="Add steps" rows="10" cols="50"></textarea>
        </div>
      </div>
    </file>
    <file name="index.js" webpack="true">
     require('angular');
     require('ring-ui/components/button/button.scss');
     require('ring-ui/components/panel/panel.scss');
     require('ring-ui/components/docked-panel-ng/docked-panel-ng');
     angular.module('DockedPanelExample', ['Ring.docked-panel']);
    </file>
  </example>
 */

/* global angular:false */
const angularModule = angular.module('Ring.docked-panel', []);

angularModule.directive('rgDockedPanel', () => ({
  link(scope, element, attrs) {
    const CSS_CLASS_NAME = 'ring-docked-panel';
    const customCssClassOnStick = attrs.rgDockedPanelClass || '';
    let panelInitialPos;
    let isPinned;

    /**
     * Sticky container
     * @type {Element} panel
     */
    const panel = element[0];

    /**
     * Save panel initial rects and left margin for further use
     */
    function savePanelInitialPos() {
      const panelClientRect = panel.getBoundingClientRect();
      panelInitialPos = panelClientRect.top + panelClientRect.height + getDocumentScrollTop();
    }

    /**
     * Pin panel at the bottom of the page
     */
    function stick() {
      panel.classList.add(CSS_CLASS_NAME);
      if (customCssClassOnStick) {
        panel.classList.add(customCssClassOnStick);
      }
      isPinned = true;
    }

    function unstick() {
      panel.classList.remove(CSS_CLASS_NAME);
      if (customCssClassOnStick) {
        panel.classList.remove(customCssClassOnStick);
      }
      isPinned = false;
    }

    /**
     * Check panel position
     */
    function checkPanelPosition() {
      const currentPanelRect = panel.getBoundingClientRect();

      if (currentPanelRect.top + currentPanelRect.height > getWindowHeight() && !isPinned) {
        stick();

      } else if (isPinned && currentPanelRect.top + currentPanelRect.height + getDocumentScrollTop() >= panelInitialPos) {
        unstick();
      }
    }

    function init() {
      const scrollListener = debounce(checkPanelPosition, 10);

      /**
       * Wait until all content on the page is loaded
       */
      scope.$applyAsync(() => {
        window.addEventListener('scroll', scrollListener);
        window.addEventListener('resize', checkPanelPosition);

        scope.$on('$destroy', () => {
          window.removeEventListener('scroll', scrollListener);
          window.removeEventListener('resize', checkPanelPosition);
        });

        savePanelInitialPos();
        checkPanelPosition();
      });
    }

    init();
  }
}));

export default angularModule.name;

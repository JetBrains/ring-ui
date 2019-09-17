import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import '../link/link__legacy.css';
import SelectNG from '../select-ng/select-ng';

import SidebarNG from './sidebar-ng';

export default {
  title: 'Legacy Angular|Sidebar Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes:
      'Provides an Angular wrapper for Sidebar. To make sidebar have fixed positioning under some other element (e.g. toolbar), a selector for that element should be passed as placeUnderSibling parameter.',
    hermione: {skip: true}
  }
};

export const basic = () => {
  angular.module(APP_NAME, [SidebarNG, SelectNG]);

  return `
      <div ng-init="isShowSideBar = true" style="position: relative;">
        <rg-sidebar
          show="isShowSideBar"
          place-under-sibling=".some-toolbar"
          top-offset="1">
          <div>

            <img class="ring-sidebar__avatar" ng-src="http://via.placeholder.com/64x64"/>

            <h3 class="ring-sidebar__title">
              <a class="ring-link" href="#">User Link</a>
            </h3>

            <div class="ring-sidebar__section">
              <span class="ring-sidebar__section-title" translate>Full Name</span>
              <div class="ring-sidebar__section-text">Value</div>
            </div>
          </div>
        </rg-sidebar>
        <div class="some-toolbar">
          Toolbar to place before sidebar
          <rg-sidebar-toggle-button model="isShowSideBar">Toggle sidebar
          </rg-sidebar-toggle-button>
        </div>
      </div>
    `;
};

basic.story = {
  name: 'basic'
};

export const aLotOfContent = () => {
  angular.module(APP_NAME, [SidebarNG, SelectNG]);

  let bigContent = '';
  let after = '';

  for (let i = 0; i < 100; i++) {
    bigContent += ` ${Math.random()}<br/>`;
    after += ` ${Math.random()}<br/>`;
  }

  bigContent += '===== The end of sidebar =====';

  return `
      <div>
        <div>
          <div>Lorem</div>
          <div>Ipsum</div>
          <div>Lorem</div>
          <div>Lorem</div>
          <div>Lorem</div>
        </div>
        <div ng-init="isShowSideBar = true" style="position: relative;">
          <rg-sidebar show="isShowSideBar" place-under-sibling=".some-toolbar" top-offset="1">
            <div>===== The start of sidebar =====
              <rg-select options="item in []"></rg-select>
              <br/>${bigContent}</div>
          </rg-sidebar>
          <div class="some-toolbar">
            Toolbar to place before sidebar
            <rg-sidebar-toggle-button model="isShowSideBar">Toggle sidebar
            </rg-sidebar-toggle-button>
          </div>
        </div>
        <div>${after}</div>
      </div>
    `;
};

aLotOfContent.story = {
  name: 'a lot of content'
};

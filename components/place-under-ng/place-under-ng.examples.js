import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';
import {getDocumentScrollTop} from '../global/dom';

import RingPlaceUnder from './place-under-ng';

export default {
  title: 'Legacy Angular|Place Under Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: `
Displays a sidebar that fills the entire right half of its container.
To make sidebar have fixed positioning under some other element (e.g. toolbar),
a selector for that element should be passed as placeUnderSibling parameter.
    `
  }
};

export const basic = () => {
  angular.module(APP_NAME, [RingPlaceUnder]);

  window.addEventListener('scroll', () => {
    const target = document.querySelector('.target-element');

    const scrolledTop = getDocumentScrollTop();
    if (scrolledTop > 30) {
      target.style.position = 'fixed';
    } else {
      target.style.position = 'static';
    }
  });

  return `
      <div class="head">Scroll down to see the effect</div>
      <div rg-place-under=".target-element" class="place-under">
        Element to be positioned under test element
      </div>

      <div class="target-element">
        Test element to sync with.
      </div>

      <div class="scrollable">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor
        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
        quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
        officia deserunt mollit anim id est laborum.
      </div>
    `;
};

basic.story = {
  name: 'basic',

  parameters: {
    storyStyles: `
  <style>
    .place-under {
      position: fixed;
      top: 0;
      right: 0;
      width: 50%;
      padding: 16px;
      background-color: #888;
    }

    .head {
      height: 30px;
    }

    .target-element {
      position: static;
      top: 0;
      width: 100%;
      padding: 16px;
      background-color: #CCC;
    }

    .scrollable {
      height: 1000px;
      padding: 16px;
      padding-top: 64px;
      background-color: #EEE;
    }
  </style>
        `
  }
};

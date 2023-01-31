import angular from 'angular';

import searchIcon from '@jetbrains/icons/search';

import RingAngularComponent from '../global/ring-angular-component';
import DialogNg from '../dialog-ng/dialog-ng';
import ShortcutsNg from '../shortcuts-ng/shortcuts-ng';
import RingTemplateNg from '../template-ng/template-ng';
import IconNg from '../icon-ng/icon-ng';
import InputNg from '../input-ng/input-ng';
import {getShortcutTitle} from '../shortcuts/shortcut-title';

import HintPopupTpl from './shortcuts-hint-ng__template';
import './shortcuts-hint-ng.css';

/**
 * @name Shortcuts Ng Hint Popup
 */

const angularModule = angular.module(
  'Ring.shortcuts.hint-popup',
  [DialogNg, ShortcutsNg, IconNg, InputNg, RingTemplateNg]
);
const getTitle = title => (typeof title === 'function' ? title() : title);


class HintPopupService extends RingAngularComponent {
  show(popupConfig = {}, shortcutModes, okButtonLabel = 'Got it', searchPlaceholder = 'Search') {
    const {dialog, shortcuts} = this.$inject;

    const modes = shortcutModes || shortcuts.getRegisteredShortcuts();

    modes.forEach(mode => {
      mode.shortcuts.forEach(shortcut => {
        shortcut.titles = shortcut.titles || [];

        if (shortcut.title && !shortcut.titles.includes(shortcut.title)) {
          shortcut.titles.push(shortcut.title);
        }
      });
    });

    return dialog.show(Object.assign({
      template: HintPopupTpl,
      closeOnClick: true,
      autoWidth: true,
      cssClass: 'shortcuts-hint__dialog',
      controllerAs: 'hintPopupCtrl',
      buttons: [{
        label: okButtonLabel,
        default: true
      }],
      controller() {
        // eslint-disable-next-line consistent-this
        const ctrl = this;

        ctrl.searchIcon = searchIcon;
        ctrl.modes = modes;
        ctrl.tailTemplate = popupConfig.tailTemplate;
        ctrl.isArray = it => Array.isArray(it);
        ctrl.searchText = '';
        ctrl.searchPlaceholder = searchPlaceholder;
        ctrl.getTitle = getTitle;
      }
    }, popupConfig));
  }
}
HintPopupService.$inject = ['dialog', 'shortcuts'];

function shortcutKeySymbolFilter(shortcut) {
  return getShortcutTitle(shortcut);
}

function shortcutSearchFilter(shortcuts, query = '') {
  return (shortcuts || []).filter(shortcut => {
    const key = shortcut.key.join ? shortcut.key.join(' ') : shortcut.key;
    const keysPresentation = shortcutKeySymbolFilter(key);

    if (!shortcut.titles.length) {
      return false;
    } else {
      const keyMatches = key.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      const titleMatches = shortcut.titles.
        map(getTitle).
        join(' ').
        toLowerCase().
        indexOf(query.toLowerCase()) !== -1;
      const presentationMatches = keysPresentation.
        toLowerCase().
        indexOf(query.toLowerCase()) !== -1;

      return keyMatches || titleMatches || presentationMatches;
    }
  });
}

angularModule.service('rgShortcutsHintPopup', HintPopupService);
angularModule.filter('shortcutKeySymbol', () => shortcutKeySymbolFilter);
angularModule.filter('shortcutSearch', () => shortcutSearchFilter);

export default angularModule.name;

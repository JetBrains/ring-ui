import { i as _objectSpread2 } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React from 'react';
import { render } from 'react-dom';
import AuthDialog from './auth-dialog.js';
import 'prop-types';
import 'classnames';
import './island.js';
import './data-tests-1a367745.js';
import './linear-function-3bd43cfe.js';
import 'style-inject';
import 'element-resize-detector';
import './schedule-raf-edeb21db.js';
import './dialog.js';
import '@jetbrains/icons/close';
import './get-uid-bf3ab014.js';
import './shortcuts.js';
import 'combokeys';
import './sniffer-c9d1f40e.js';
import 'sniffr';
import './tab-trap.js';
import './dom-0ae85140.js';
import './button-c0bc1992.js';
import 'focus-visible';
import '@jetbrains/icons/chevron-10px';
import './icon.js';
import 'util-deprecate';
import './memoize-ad2c954c.js';
import './theme-9a053da9.js';
import './clickableLink-3fc5662b.js';
import './popup.target-9daf0591.js';
import 'scrollbar-width';

/**
 * @name Auth Dialog Service
 */

var containerElement = document.createElement('div');
/**
 * Renders AuthDialog into virtual node to skip maintaining container
 */

function renderAuthDialog(props) {
  render( /*#__PURE__*/React.createElement(AuthDialog, props), containerElement);
}

function showAuthDialog() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  renderAuthDialog(_objectSpread2(_objectSpread2({}, props), {}, {
    show: true
  }));
  return function () {
    renderAuthDialog({
      show: false
    });
  };
}

export default showAuthDialog;

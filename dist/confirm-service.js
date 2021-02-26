import { i as _objectSpread2 } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React from 'react';
import { render } from 'react-dom';
import Confirm from './confirm.js';
import 'prop-types';
import './dialog.js';
import 'classnames';
import '@jetbrains/icons/close';
import './island.js';
import './data-tests-1a367745.js';
import './linear-function-3bd43cfe.js';
import 'style-inject';
import 'element-resize-detector';
import './schedule-raf-edeb21db.js';
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
import './panel.js';

/**
 * @name Confirm Service
 */

var containerElement = document.createElement('div');
/**
 * Renders Confirm into virtual node to skip maintaining container
 */

function renderConfirm(props) {
  render( /*#__PURE__*/React.createElement(Confirm, props), containerElement);
}

function confirm(_ref) {
  var text = _ref.text,
      description = _ref.description,
      _ref$confirmLabel = _ref.confirmLabel,
      confirmLabel = _ref$confirmLabel === void 0 ? 'OK' : _ref$confirmLabel,
      _ref$rejectLabel = _ref.rejectLabel,
      rejectLabel = _ref$rejectLabel === void 0 ? 'Cancel' : _ref$rejectLabel,
      cancelIsDefault = _ref.cancelIsDefault,
      onBeforeConfirm = _ref.onBeforeConfirm;
  return new Promise(function (resolve, reject) {
    var props = {
      text: text,
      description: description,
      confirmLabel: confirmLabel,
      rejectLabel: rejectLabel,
      cancelIsDefault: cancelIsDefault,
      show: true,
      onConfirm: function onConfirm() {
        if (onBeforeConfirm) {
          renderConfirm(_objectSpread2(_objectSpread2({}, props), {}, {
            inProgress: true
          }));
          return Promise.resolve(onBeforeConfirm()).then(function () {
            renderConfirm({
              show: false
            });
            resolve();
          }).catch(function (err) {
            renderConfirm({
              show: false
            });
            reject(err);
          });
        }

        renderConfirm({
          show: false
        });
        return resolve();
      },
      onReject: function onReject() {
        renderConfirm({
          show: false
        });
        reject(new Error('Confirm(@jetbrains/ring-ui): null exception'));
      }
    };
    renderConfirm(props);
  });
}
function hideConfirm() {
  renderConfirm({
    show: false
  });
}

export default confirm;
export { containerElement, hideConfirm };

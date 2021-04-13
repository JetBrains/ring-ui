import {babel} from '@rollup/plugin-babel';
import styles from 'rollup-plugin-styles';
import globals from 'rollup-plugin-node-globals';
import replace from '@rollup/plugin-replace';
import clear from 'rollup-plugin-clear';
import browserslist from 'browserslist';


const TARGET_DIR = 'dist';

export default {
  external: id => {
    const isInternal = id.startsWith('.') || id.startsWith('/');
    return !isInternal;
  },

  input: [
    'components/alert/alert.js',
    'components/alert-service/alert-service.js',
    'components/analytics/analytics.js',
    'components/auth/auth.js',
    'components/auth-dialog/auth-dialog.js',
    'components/auth-dialog-service/auth-dialog-service.js',
    'components/avatar/avatar.js',
    'components/badge/badge.js',
    'components/button/button.js',
    'components/button-group/button-group.js',
    'components/button-set/button-set.js',
    'components/button-toolbar/button-toolbar.js',
    'components/caret/caret.js',
    'components/checkbox/checkbox.js',

    // 'components/code/code.js', // highlight.js import

    'components/confirm/confirm.js',
    'components/confirm-service/confirm-service.js',
    'components/content-layout/content-layout.js',
    'components/contenteditable/contenteditable.js',
    'components/data-list/data-list.js',
    'components/date-picker/date-picker.js',
    'components/dialog/dialog.js',
    'components/dropdown/dropdown.js',
    'components/error-bubble/error-bubble.js',
    'components/error-message/error-message.js',
    'components/footer/footer.js',
    'components/grid/grid.js',
    'components/group/group.js',
    'components/header/header.js',
    'components/header/logo.js',
    'components/heading/heading.js',
    'components/http/http.js',
    'components/hub-source/hub-source.js',
    'components/icon/icon.js',
    'components/input/input.js',
    'components/island/island.js',
    'components/link/link.js',
    'components/list/list.js',
    'components/loader/loader.js',
    'components/loader/loader.js',
    'components/loader-inline/loader-inline.js',
    'components/loader-screen/loader-screen.js',
    'components/login-dialog/login-dialog.js',

    // 'components/markdown/markdown.js', // uses code.js that fails

    'components/message/message.js',
    'components/old-browsers-message/old-browsers-message.js',
    'components/pager/pager.js',
    'components/panel/panel.js',
    'components/permissions/permissions.js',
    'components/popup/popup.js',
    'components/popup-menu/popup-menu.js',
    'components/progress-bar/progress-bar.js',
    'components/proxy-attrs/proxy-attrs.js',
    'components/query-assist/query-assist.js',
    'components/radio/radio.js',
    'components/select/select.js',
    'components/shortcuts/shortcuts.js',
    'components/storage/storage.js',
    'components/tab-trap/tab-trap.js',
    'components/table/table.js',
    'components/table/selection.js',
    'components/tabs/tabs.js',
    'components/tag/tag.js',
    'components/tags-input/tags-input.js',
    'components/tags-list/tags-list.js',
    'components/text/text.js',
    'components/toggle/toggle.js',
    'components/tooltip/tooltip.js',

    // 'components/user-agreement/user-agreement.js', // uses markdown that uses code that fails

    'components/user-card/user-card.js'
  ],

  output: {
    dir: TARGET_DIR,
    format: 'esm',
    assetFileNames: '[name][extname]'
  },

  plugins: [
    clear({
      targets: [TARGET_DIR]
    }),

    babel({
      babelHelpers: 'bundled',

      presets: [
        ['@jetbrains/babel-preset-jetbrains', {
          useBuiltIns: 'entry',
          // useBuiltIns: 'usage',
          corejs: '3'
        }]
      ],
      plugins: [
        ['babel-plugin-transform-define', {
          SUPPORTED_BROWSERS: browserslist()
        }]
      ],
      env: {
        test: {
          plugins: ['require-context-hook']
        }
      }
    }),

    styles({
      modules: true,

      mode: ['extract', 'style.css'],

      config: true,

      minimize: true
    }),

    globals(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    })
  ]
};

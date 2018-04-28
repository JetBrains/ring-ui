import 'iframe-resizer/js/iframeResizer.contentWindow';
import classNames from 'classnames';
import URLSearchParams from 'url-search-params'

import styles from './example-common.css';

const params = new URLSearchParams(location.search.slice(1));
document.body.className = classNames(styles.body, {
  [styles.blockAnimations]: params.has('block-animations')
});

if (window.parent !== window) {
  try {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  } catch (error) {
  }
}

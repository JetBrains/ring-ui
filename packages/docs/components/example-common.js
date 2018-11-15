import 'iframe-resizer/js/iframeResizer.contentWindow';
import classNames from 'classnames';
import URLSearchParams from 'url-search-params'
import darkVariables from '@jetbrains/ring-ui/components/global/variables_dark';
import {setRootStyleProperties, resetRootStyleProperties} from '@jetbrains/ring-ui/components/global/dom';

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

function toggleDarkTheme(isOn) {
  isOn ? setRootStyleProperties(darkVariables) : resetRootStyleProperties(darkVariables);
}

window.addEventListener('message', event => {
  try {
    const message = JSON.parse(event.data);
    if (message.type === 'RING_DARK_THEME') {
      toggleDarkTheme(message.value);
    }
  } catch (e) {

  }
});

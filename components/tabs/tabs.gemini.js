/* global gemini: false */
import styles from './tabs.css';

gemini.suite('Tabs', suite => {
  suite.
    setUrl('/example-tabs/index.html').
    setCaptureElements('#tabs').

    capture('tab').

    capture('click-on-tab', (actions, find) => {
      actions.click(find(`.${styles.title}:nth-child(3)`));
    }).

    capture('do-not-switch-to-disabled-tab', (actions, find) => {
      actions.click(find(`.${styles.title}:nth-child(4)`));
    });
});

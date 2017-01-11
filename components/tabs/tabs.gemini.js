/* global gemini: false */

gemini.suite('Tabs', suite => {
  suite.
    setUrl('dumb-tabs/tabs.html').
    setCaptureElements('#tabs').

    capture('tab').

    capture('click-on-tab', (actions, find) => {
      actions.click(find('div>div>div:nth-child(3)'));
    }).

    capture('do-not-switch-to-disabled-tab', (actions, find) => {
      actions.click(find('div>div>div:nth-child(4)'));
    });
});

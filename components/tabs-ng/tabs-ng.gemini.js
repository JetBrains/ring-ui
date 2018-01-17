/* global gemini: false */

gemini.suite('Tabs Ng', suite => {
  suite.
    setUrl('tabs-ng/tabs-ng.html#!?tab=access').
    setCaptureElements('body > div').

    capture('tab-from-route').

    capture('click-on-tab', (actions, find) => {
      actions.click(find('[data-test="ring-tab"]:nth-child(4)'));
    }).

    capture('do-not-switch-to-disabled-tab', (actions, find) => {
      actions.click(find('[data-test="ring-tab"]:nth-child(3)'));
    });
});

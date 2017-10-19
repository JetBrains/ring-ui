/* global gemini: false */

gemini.suite('Tabs', () => {
  gemini.suite('Light Tabs', child => {
    child.
      setUrl('tabs/tabs.html').
      setCaptureElements('#tabs').

      capture('tab').

      capture('hovered', (actions, find) => {
        actions.mouseMove(find('div>div>div:nth-child(2)'));
      }).

      capture('click-on-tab', (actions, find) => {
        actions.click(find('div>div>div:nth-child(3)'));
      }).

      capture('do-not-switch-to-disabled-tab', (actions, find) => {
        actions.click(find('div>div>div:nth-child(4)'));
      });
  });

  gemini.suite('Dark Tabs', child => {
    child.
      setUrl('tabs/dark-tabs.html').
      setCaptureElements('#dark').

      capture('dark-tab').

      capture('hovered', (actions, find) => {
        actions.mouseMove(find('div>div>div:nth-child(2)'));
      }).

      capture('click-on-dark-tab', (actions, find) => {
        actions.click(find('div>div>div:nth-child(3)'));
      });
  });
});

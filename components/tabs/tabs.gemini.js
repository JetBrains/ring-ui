/* global gemini: false */

gemini.suite('Tabs', () => {
  gemini.suite('Light Tabs', child => {
    child.
      setUrl('tabs/tabs.html').
      setCaptureElements('#tabs').

      capture('tab').

      capture('hovered', (actions, find) => {
        actions.mouseMove(find('div>div>button:nth-child(2),div>div>a'));
      }).

      capture('click-on-tab', (actions, find) => {
        actions.click(find('div>div>button:nth-child(3),div>div>a'));
      }).

      capture('do-not-switch-to-disabled-tab', (actions, find) => {
        actions.click(find('div>div>button:nth-child(4),div>div>a'));
      });
  });

  gemini.suite('Dark Tabs', child => {
    child.
      setUrl('tabs/dark-tabs.html').
      setCaptureElements('#dark').

      capture('dark-tab').

      capture('hovered', (actions, find) => {
        actions.mouseMove(find('div>div>button:nth-child(2)'));
      }).

      capture('click-on-dark-tab', (actions, find) => {
        actions.click(find('div>div>button:nth-child(3)'));
      });
  });
});

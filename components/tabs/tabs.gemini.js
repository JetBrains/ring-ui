/* global gemini: false */

gemini.suite('Tabs', () => {
  gemini.suite('Light Tabs', child => {
    child.
      setUrl('tabs/tabs.html').
      setCaptureElements('#tabs').

      capture('tab').

      capture('hovered', (actions, find) => {
        actions.mouseMove(find('div>div>button:nth-child(2)'));
      }).

      capture('hovered-link', (actions, find) => {
        actions.mouseMove(find('div>div>a'));
      }).

      capture('click-on-tab', (actions, find) => {
        actions.click(find('div>div>button:nth-child(3)'));
      }).

      capture('click-on-tab-link', (actions, find) => {
        actions.click(find('div>div>a'));
      }).

      capture('do-not-switch-to-disabled-tab', (actions, find) => {
        actions.click(find('div>div>button:nth-child(5)'));
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

      capture('hovered-link', (actions, find) => {
        actions.mouseMove(find('div>div>a'));
      }).

      capture('click-on-dark-tab-link', (actions, find) => {
        actions.click(find('div>div>a'));
      }).

      capture('click-on-dark-tab', (actions, find) => {
        actions.click(find('div>div>button:nth-child(3)'));
      });
  });

  gemini.suite('Custom titles', child => {
    child.
      setUrl('tabs/custom-titles.html').
      setCaptureElements('#tabs').

      capture('custom-titles');
  });
});

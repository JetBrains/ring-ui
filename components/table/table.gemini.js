/* global gemini: false */

const ANIMATION_DELAY = 400;

gemini.suite('Table', suite => {
  suite.setUrl('/table/table.html');

  suite.setCaptureElements('table');

  suite.capture('table', (actions, find) => {
    actions.mouseMove(find('body'), {x: 800, y: 1024});
    actions.wait(ANIMATION_DELAY);
  });

  suite.capture('with a caption', (actions, find) => {
    actions.click(find('#button-with-a-caption button'));
    actions.mouseMove(find('body'), {x: 800, y: 1024});
    actions.wait(ANIMATION_DELAY);
  });

  suite.capture('non-selectable', (actions, find) => {
    actions.click(find('#button-with-a-caption button'));
    actions.click(find('#button-non-selectable button'));
    actions.mouseMove(find('body'), {x: 800, y: 1024});
    actions.wait(ANIMATION_DELAY);
  });

  suite.capture('bulgaria', (actions, find) => {
    actions.click(find('#button-non-selectable button'));
    actions.click(find('#button-select-bulgaria button'));
    actions.mouseMove(find('body'), {x: 800, y: 1024});
    actions.wait(ANIMATION_DELAY);
  });
});

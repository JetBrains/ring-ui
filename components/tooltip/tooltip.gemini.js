/* global gemini: false */

gemini.suite('Tooltip', () => {
  const TOOLTIP_DELAY = 1000;

  gemini.suite('displayed', child => {
    child.
      setUrl('tooltip/tooltip.html').
      setCaptureElements(['body']).
      before((actions, find) => {
        this.button = find('#button-with-explanation');
      }).
      capture('element-is-hovered', actions => {
        actions.
          mouseMove(this.button).
          wait(TOOLTIP_DELAY);
      });
  });

  gemini.suite('displayed-on-self-overflow', child => {
    child.
      setUrl('tooltip/tooltip-can-only-be-displayed-when-necessary.html').
      setCaptureElements(['body']).
      before((actions, find) => {
        this.fullTextElement = find('.lorem-ipsum__text');
        this.cutTextElement = find('.lorem-ipsum__text_overflow');
      }).
      capture('full-text-element', actions => {
        actions.
          mouseMove(this.fullTextElement).
          wait(TOOLTIP_DELAY);
      }).
      capture('cut-text-element', actions => {
        actions.
          mouseMove(this.cutTextElement).
          wait(TOOLTIP_DELAY);
      });
  });
});

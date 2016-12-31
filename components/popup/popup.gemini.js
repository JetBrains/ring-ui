/* global gemini: false */

gemini.suite('Popup', () => {
  gemini.suite('Popups', child => {
    child.
      setUrl('/popup/popup.html').
      setCaptureElements(['#top__left', '#top__right', '#bottom__left', '#bottom__right']).
      capture('popup-different-directions');
  });

  gemini.suite('Autoposition', child => {
    child.
      setUrl('/popup/auto-positioning-a-popup.html').
      setCaptureElements(['#leftSide', '#rightSide', '#downSide', '#topSide']).
      capture('popup-autoposition');
  });
});

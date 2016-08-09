import gemini from 'gemini';

gemini.suite('Popup', () => {
  gemini.suite('Popups', child => {
    child.
      setUrl('/example-popup').
      setCaptureElements(['#top__left', '#top__right', '#bottom__left', '#bottom__right']).
      capture('popup-different-directions');
  });

  gemini.suite('Autoposition', child => {
    child.
      setUrl('/example-auto-positioning-a-popup/').
      setCaptureElements(['#leftSide', '#rightSide', '#downSide', '#topSide']).
      capture('popup-autoposition');
  });
});

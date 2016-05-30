import gemini from 'gemini';

gemini.suite('Popup', () => {
  gemini.suite('Popups', child => {
    child.
      setUrl('/example-popup').
      setCaptureElements(['#target1', '#target2', '#target3', '#target4']).
      capture('popup-different-directions');
  });

  gemini.suite('Autoposition', child => {
    child.
      setUrl('/example-popup-autoposition/').
      setCaptureElements(['#leftSide', '#rightSide', '#downSide', '#topSide']).
      capture('popup-autoposition');
  });
});

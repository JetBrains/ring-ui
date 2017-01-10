/* global gemini: false */

gemini.suite('Popup', () => {
  gemini.suite('Popups', child => {
    child.
      setUrl('/popup/popup.html').
      setCaptureElements('.topLeft', '.topRight', '.bottomLeft', '.bottomRight').
      capture('popup-different-directions');
  });

  gemini.suite('Autoposition', child => {
    child.
      setUrl('/popup/auto-positioning-a-popup.html').
      setCaptureElements('.left', '.right', '.bottom', '.top').
      capture('popup-autoposition');
  });
});

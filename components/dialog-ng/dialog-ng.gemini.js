/* global gemini: false */

gemini.suite('Dialog Ng', () => {
  gemini.suite('dialog', child => {
    child.
      setUrl('dialog-ng/dialog-ng.html?block-animations').
      setCaptureElements(['*[data-test~=ring-dialog]']).
      capture('dialog');
  });

  gemini.suite('dialog with custom styles', child => {
    child.
      setUrl('dialog-ng/dialog-ng-with-overridden-styles.html?block-animations').
      setCaptureElements(['*[data-test~=ring-dialog]']).
      capture('dialog with custom styles');
  });
});

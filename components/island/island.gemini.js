/* global gemini: false */

gemini.suite('Island', () => {
  gemini.suite('Simple island', child => {
    child.
      setUrl('island/island.html').
      setCaptureElements('*[data-test~=ring-island]').
      capture('island');
  });

  gemini.suite('Island with scroll', child => {
    child.
      setUrl('island/island-with-scroll.html').
      skip('edge', 'Disabled in EDGE because of weird rendering artifact').
      setCaptureElements('*[data-test~=ring-island]').
      capture('island');
  });
});

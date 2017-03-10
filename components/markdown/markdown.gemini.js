/* global gemini: false */

gemini.suite('Markdown', suite => {
  suite.
    setUrl('/markdown/markdown.html').
    setCaptureElements('#markdown').
    capture('markdown');
});

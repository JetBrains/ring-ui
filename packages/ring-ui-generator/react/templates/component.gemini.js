/* global gemini: false */

gemini.suite('<%= titleCaseName %>', suite => {
  suite.
  setUrl('/<%= paramCaseNameSuffix %>/<%= paramCaseNameSuffix %>.html').
    setCaptureElements('#<%= paramCaseName %>').
    capture('<%= paramCaseName %>');
});

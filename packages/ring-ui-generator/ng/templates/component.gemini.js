/* global gemini: false */

gemini.suite('<%= titleCaseName %>', suite => {
  suite.
    setUrl('/example-<%= paramCaseNameSuffix %>/').
    setCaptureElements('#<%= paramCaseName %>').
    capture('<%= paramCaseName %>');
});

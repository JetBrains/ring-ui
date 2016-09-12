import gemini from 'gemini';

gemini.suite('<%= titleCaseName %>', suite => {
  suite.
    setUrl('/example-<%= paramCaseNameSuffix %>/').
    setCaptureElements('#<%= paramCaseName %>').
    capture('<%= paramCaseName %>');
});

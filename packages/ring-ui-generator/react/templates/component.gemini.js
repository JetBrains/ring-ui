import gemini from 'gemini';

gemini.suite('<%= titleCaseName %>', suite => {
  suite.
    setUrl('/example-<%= paramCaseName %>/').
    setCaptureElements('#<%= paramCaseName %>').
    capture('<%= paramCaseName %>');
});

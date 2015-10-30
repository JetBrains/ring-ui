import gemini from 'gemini';

gemini.suite('Icon', function (parent) {
  parent.setUrl('/example-icon/');
  parent.setTolerance(4); //Increase tolerance to avoid wrong render artifacts detecting

  gemini.suite('Example icons', function (child) {
    child
      .setCaptureElements('#some-icons')
      .capture('some icons');
  });
});

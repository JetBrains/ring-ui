var Gemini = require('gemini/api');

var gemini = new Gemini('.gemini.yml',
  {
    rootUrl: require('os').hostname() + ':9999'
  }
);

gemini.test(['components/alert/alert.gemini.js'], {
  //reporters: ['html']
})
  .done(function (res) {
    console.log('Done', res);
  });

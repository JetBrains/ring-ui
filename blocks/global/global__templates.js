define(['handlebars'], function(Handlebars) {
  'use strict';

  var render = function(template, data) {
    return Handlebars.partials[template](data);
  };

  return {
    render: render
  };

});
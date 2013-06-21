/* global Handlebars */
Handlebars.registerHelper('stringify', function(items) {
  return $.toJSON(items);
});
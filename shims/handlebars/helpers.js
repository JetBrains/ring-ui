/* global Handlebars */
Handlebars.registerHelper('stringify', function(items) {
  return $.toJSON(items);
});


// Example: {{#ifEqual type 'gradient'}} ring-menu_gradient{{/ifEqual}}"
Handlebars.registerHelper('ifEqual', function(a, b, context) {
  if(a === b) {
    return context.fn(this);
  } else {
    return context.inverse(this);
  }
});

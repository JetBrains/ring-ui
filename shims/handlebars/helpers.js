/* global Handlebars */
Handlebars.registerHelper('stringify', function(items) {
  return typeof items === 'string' ? items : JSON.stringify(items);
});


// Example: {{#ifEqual type 'gradient'}} ring-menu_gradient{{/ifEqual}}"
Handlebars.registerHelper('ifEqual', function(a, b, context) {
  if(a === b) {
    return context.fn(this);
  } else {
    return context.inverse(this);
  }
});

Handlebars.registerHelper('copyright', function(year, context) {
  var currentYear = (new Date()).getUTCFullYear();

  var ret = '© ';

  if (currentYear === year) {
    ret += currentYear;
  } else {
    ret += year + '—' + currentYear;
  }

  return ret;
});

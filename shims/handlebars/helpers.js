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

Handlebars.registerHelper('copyright', function(year) {
  var currentYear = (new Date()).getUTCFullYear();

  var ret = '© ';

  if (year >= currentYear) {
    ret += year;
  } else {
    ret += year + '—' + currentYear;
  }

  return ret;
});

// Example: {{#typeof this 'string'}} {{this}}{{/typeof}}"
Handlebars.registerHelper('ifOr', function() {
  // Al arguments except content
  var args = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
  var context = arguments[arguments.length - 1];

  for (var i = args.length - 1; i >= 0; i--) {
    if (args[i]) {
      return context.fn(this);
    }
  }

  return context.inverse(this);
});
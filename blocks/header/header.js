define(['jquery',  'global/global__modules', 'global/global__views'], function($, Module, View) {
  'use strict';

  var process = function(data) {
    if (data.user) {
      var links = data.personalLinks && data.personalLinks.length ? [].concat(data.personalLinks) : [];

      for (var link in data.authLinks) {
        if (link !== 'login') {
          links.push(data.authLinks[link]);
        }
      }

      data.personal = {
        username: data.user.name,
        items: links
      };
    }

    return data;
  };

  Module.add('header', {
    'init': function(data) {

      View.update('header', process(data));
    }
  });

});

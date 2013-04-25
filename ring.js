(function($) {
  // Figure out CSS location from script location
  var scripts = document.getElementsByTagName('script');
  var this_script = scripts[scripts.length - 1];

  // Looks like we are being loaded dynamically
  if (!this_script.src) {
    for (var i=0; i<scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.indexOf('ring.js') > -1) {
        this_script = scripts[i];
        break;
      }
    }
  }

  // Still could not find ourselves
  if (!this_script.src) return;

  var script_path = this_script.src;
  var script_folder = script_path.substr(0, script_path.lastIndexOf('/') + 1);

  var stylesheet = document.createElement('link');
  stylesheet.type = 'text/css';
  stylesheet.rel = 'stylesheet';
  stylesheet.href = script_folder + 'ring.css';

  var head = document.getElementsByTagName('head')[0];
  head.insertBefore(stylesheet, head.firstChild);

  $(function() {
    var services = [
      {
        name: 'TeamCity',
        url: '//teamcity.jetbrains.com'
      },
      {
        name: 'YouTrack',
        url: '//youtrack.jetbrains.com'
      },
      {
        name: 'Upsource',
        url: '//upsource.jetbrains.com'
      }
    ];

    var body = $('body');
    var ring_links = $('<div class="ring-links"/>');

    for (var i=0; i<services.length; i++) {
      var ring_link = $('<a class="ring-links__link"/>');
      ring_link.html(services[i].name);
      ring_link.attr('href', services[i].url);

      if (window.location.toString().indexOf(services[i].url) > -1) {
        ring_link.addClass('ring-links__link_active');
      }

      ring_link.appendTo(ring_links);
    }

    body.addClass('ring');
    ring_links.insertBefore(body.get(0).firstChild);
  });
})(jQuery);
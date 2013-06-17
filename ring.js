(function($, global) {
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
//    if (!this_script.src) return;
//
//    var script_path = this_script.src;
//    var script_folder = script_path.substr(0, script_path.lastIndexOf('/') + 1);

    var script_folder = 'http://localhost:8000/';

    var stylesheet = document.createElement('link');
    stylesheet.type = 'text/css';
    stylesheet.rel = 'stylesheet';
    stylesheet.href = script_folder + 'ring.css';

    var head = document.getElementsByTagName('head')[0];
    head.insertBefore(stylesheet, head.firstChild);


    // @include node_modules/grunt-contrib-handlebars/node_modules/handlebars/dist/handlebars.runtime.js

    Handlebars.registerHelper('stringify', function(items) {
        return JSON.stringify(items);
    });

    // @include ring.hbs.js

    // @include blocks/dropdown/_dropdown.js

    var ring = {
        init: function(data) {
            data = data || this.data;

            var ringLinks = $(Handlebars.partials['full-header'](data));
            $(function() {
                $('body').prepend(ringLinks)
            });
        },
        // Youtrack test
        data: /* @include youtrack.json*/
    };

    $('.header').hide();
    global.ring = ring;

})(jQuery, this);

// @include blocks/font-icon/font-icon.ie7.js

;(function($, Handlebars, global) {
    var ring = {
        init: function(data) {
            data = data || this.data;

            var ringLinks = $(Handlebars.partials['full-header'](data));
            $(function() {
                $('body').prepend(ringLinks)
            });
        }
    };

    global.ring = ring;
}(jQuery, Handlebars, this));

;(function($) {
    var icons = {
        'font-icon_search' : '&#xf002;',
        'font-icon_caret-down' : '&#xf0d7;',
        'font-icon_help' : '&#xe001;',
        'font-icon_cog' : '&#xf013;'
    }

    $(function() {
        $('.font-icon').each(function(index, el) {
            var $el = $(el);
            var cls = $el.attr('class').match(/font-icon_[^\s'"]+/);
            var icon = cls && icons[cls[0]];

            if (cls && icons[cls[0]]) {
                $el.prepend('<span style="font-family: \'font-icon\'">' + icon + '</span>')
            }
        })
    });
}($));
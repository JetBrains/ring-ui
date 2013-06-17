;(function($) {
    $(function() {
        var $body = $('body');
        var $dropdown;

        // Using delegate bacause of compability with Youtrack's jQuery 1.5.1
        $body.delegate('.component-dropdown', 'click', function() {
            if ($dropdown) {
                return;
            }

            var $this = $(this);
            var data = $this.data('component');

            $dropdown = $(Handlebars.partials['dropdown'](data));

            $dropdown.appendTo($body);

            var pos = $this.offset();
            pos.top += $this.outerHeight() + 15;
            pos.left += $this.outerWidth() / 2 - $dropdown.width() / 2;

            $dropdown.css(pos);

            $body.one('click', function() {
                $dropdown.remove();
                $dropdown = null;
            })
        });
    });
}(jQuery));
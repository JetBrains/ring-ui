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

            $dropdown = $(templates['_dropdown'](data));

            $dropdown.appendTo($body);

            var pos = $this.position();
            pos.top += $this.height() + 10;
            pos.left += $this.width() / 2 - $dropdown.width() / 2;

            console.log(data)
            $dropdown.css(pos);

            $body.one('click', function() {
                $dropdown.remove();
                $dropdown = null;
            })
        });
    });
}(jQuery));
/**
 * Custom useful matchers for jasmine
 */
beforeEach(function() {
    var englishyPredicate = function(matcherName) {
        return matcherName.replace(/[A-Z]/g, function(s) {
            return ' ' + s.toLowerCase();
        });
    };

    this.addMatchers({
        toHaveClass: function(className) {
            this.message = function() {
                var args = Array.prototype.slice.apply(arguments);
                return "Expected " + jasmine.pp(this.actual) + (this.isNot ? " not " : " ") + englishyPredicate('toHaveClass') + ' `' + jasmine.pp(args.join()) + '`, but have `' + this.actual.className + '`.';
            };

            return (new RegExp('\\b' + className + '\\b')).test(this.actual.className);
        }
    });
});

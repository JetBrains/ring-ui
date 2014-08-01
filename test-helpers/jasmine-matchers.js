/**
 * Custom useful matchers for jasmine
 */
beforeEach(function () {
  jasmine.addMatchers({
    toHaveClass: function () {
      return {
        compare: function (actual, expectedClassName) {
          var actualClassName = actual.className;

          var result = {
            pass: (new RegExp('\\b' + expectedClassName + '\\b')).test(actualClassName)
          };

          result.message = 'Expected ' + jasmine.pp(actual) + (result.pass ? ' not' : '') + ' to have class `' + expectedClassName + '`, but it have `' + actualClassName + '`.';

          return result;
        }
      };
    },
    toBeInstanceOf: function () {
      return {
        compare: function (actual, expectedInstance) {
          var result = {
            pass: actual instanceof expectedInstance
          };

          // TODO Do something with constructors' names
          result.message = 'Expected ' + actual.constructor.name + (result.pass ? ' not' : '') + ' to be instance of ' + expectedInstance.name;

          return result;
        }
      };
    }
  });
});

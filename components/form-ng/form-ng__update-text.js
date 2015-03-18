/* global angular: false */
require('form-ng/form-ng');
require('form-ng/form-ng.scss');
require('message-bundle-ng/message-bundle-ng.js');

angular.module('Ring.form')

  .directive('rgFormUpdateText', [
    '$timeout',
    'RingMessageBundle',
    function ($timeout, RingMessageBundle) {
      return {
        replace: true,
        scope: {
          label: '@',
          description: '@',
          placeholder: '@',
          item: '=',
          field: '@',
          isMultiLine: '&multiline',
          parseElement: '&',
          formatElement: '&',
          isLong: '&long',
          ngDisabled: '=',
          ngRequired: '=',
          type: '@',
          onSave: '='
        },
        template: require('./form-ng__update-text.html'),
        link: function (scope, iElement, iAttrs) {
          // Generate random string
          scope.inputId = Math.random().toString(36).substring(2);
          scope.initial = scope.item[scope.field];

          // Special formatting and parsing for array values
          if (scope.isMultiLine() === 'list') {
            var stopWatch = scope.$watch('form.input', function (input) {
              if (input) {
                input.$formatters.push(function (value) {
                  if (!value) {
                    return value;
                  }
                  if (iAttrs.formatElement) {
                    value = value.map(function (element) {
                      return scope.formatElement({element: element});
                    });
                  }
                  return value.join('\n');
                });
                input.$parsers.push(function (value) {
                  var array = value && value.split(/(\r\n|\n|\r)/gm) || [];
                  var notEmpty = function (val) {
                    return val && val.trim();
                  };
                  if (iAttrs.parseElement) {
                    array = array.filter(notEmpty).map(function (element) {
                      return scope.parseElement({element: element.trim()});
                    });
                  }
                  return array;
                });

                stopWatch();
              }
            });
          }

          var success = function () {
            scope.initial = scope.item[scope.field];
            scope.form.input.$setPristine();

            scope.done = true;

            $timeout(function () {
              scope.done = false;
            }, 1000);
          };

          scope.changed = function () {
            scope.onSave(scope.item, scope.field, success, angular.noop);
          };

          scope.inputKey = function ($event) {
            if ($event.keyCode === 27) {
              // Esc
              if (scope.form.input.$dirty) {
                scope.item[scope.field] = scope.initial;
              }
              $event.stopPropagation();
              $event.preventDefault();
            } else if ($event.keyCode === 13 && ($event.ctrlKey || $event.metaKey || !scope.isMultiLine())) {
              // Enter
              if (scope.form.input.$dirty && scope.form.input.$valid) {
                scope.changed();
              }
              $event.stopPropagation();
              $event.preventDefault();
            }
          };

          scope.errorMessage = function (error) {
            var msgs = [];
            angular.forEach(error, function (value, key) {
              if (value && RingMessageBundle[key]) {
                msgs.push(RingMessageBundle[key]());
              }
            });
            return msgs.join(', ');
          };
        }
      };
    }
  ]);

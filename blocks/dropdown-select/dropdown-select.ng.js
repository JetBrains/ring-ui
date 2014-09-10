(function () {
  'use strict';

  angular.module('Ring.dropdown-select', []).
    directive('dropdownSelectInput', [function () {
      return {
        require: '^dropdownSelect',
        link: function (scope, iElement, iAttrs, dropdownSelectCtrl) {
          dropdownSelectCtrl.setInput(iElement);
        }
      };
    }]).
    directive('dropdownSelect', [
      'dropdownSelectOptionsParser',
      '$parse',
      '$interpolate',
      function (dropdownSelectOptionsParser, $parse, $interpolate) {
        return {
          restrict: 'E',
          scope: true,
          templateUrl: 'dropdown-select/dropdown-select.ng.html',
          replace: true,
          require: ['dropdownSelect', 'ngModel'],
          link: function (scope, iElement, iAttrs, ctrls) {
            var dropdownSelectCtrl = ctrls[0];
            var ngModelCtrl = ctrls[1];
            dropdownSelectCtrl.setNgModelCtrl(ngModelCtrl);
          },
          controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            var options = dropdownSelectOptionsParser.parse($scope, $attrs);

            $scope.placeholder = $interpolate($attrs.placeholder)($scope);
            $scope.inputId = $attrs.inputId;

            var disabledGetter = $parse($attrs.ngDisabled);
            $scope.disabled = function() {
              return disabledGetter($scope);
            };

            var onChange = $parse($attrs.onChange);
            var onSubmit = $parse($attrs.onSubmit);

            var $input;
            this.setInput = function (input) {
              $input = input;
              var dropdownSelect = ring('dropdown-select');
              dropdownSelect('init', {
                target: $input,
                type: $attrs.type,
                description: $attrs.description,
                noErrors: 'noErrors' in $attrs,
                limitWidth: 'auto',
                onSelect: function (item) {
                  $scope.$apply(function () {
                    ngModel.$setViewValue(item.data);
                  });
                  $input.val(item ? item.label : '');
                  onChange($scope, {data: item.data});
                },
                onChange: function (value) {
                  onChange($scope, {value: value});
                },
                onSubmit: function (value) {
                  onSubmit($scope, {value: value});
                },
                onHide: function () {
                  ngModel.$render();
                },
                dataSource: options.datasource
              });
              if (angular.isDefined($attrs.autofocus)) {
                $input.focus();
              }

              // Without following code open dropdown-select may stick when dialog is closed
              $scope.$on('$destroy', function () {
                ring('action-list')('remove');
              });
            };

            $scope.focus = function () {
              if ($input) {
                $input.focus();
              }
            };

            var ngModel;
            this.setNgModelCtrl = function (ctrl) {
              ngModel = ctrl;
              ngModel.$render = function () {
                $input.val(ngModel.$viewValue ? options.getLabel(ngModel.$viewValue) : null);
              };
            };
          }]
        };
      }
    ]).
    factory('dropdownSelectOptionsParser', ['$parse', '$interpolate', function ($parse, $interpolate) {
      var OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+(?:of\s+(.*)\s+kind\s+)?for\s+([\$\w]+)\s+in\s+(.*?)$/;

      return {
        parse: function (scope, $attrs) {
          var match;
          if (!(match = $attrs.options.match(OPTIONS_REGEXP))) {
            console.error('Bad dropdownSelect expression format. Expected: {item.label} [as {item.labelPropertyName}] [of {item.kind} kind] for {item} in {items}');
          }

          var labelGetter = $parse(match[1]);
          var labelName = match[2] || 'label';
          var descriptionGetter = match[3] && $parse(match[3]);
          var optionVariableName = match[4];
          var datasourceGetter = $parse(match[5]);

          function getLabel(option) {
            var locals = {};
            locals[optionVariableName] = option;
            return labelGetter(scope, locals);
          }

          function getDescription(option) {
            var locals = {};
            locals[optionVariableName] = option;
            return descriptionGetter(scope, locals);
          }

          return {
            getLabel: getLabel,
            hasDescription: !!descriptionGetter,
            datasource: function (query, top) {
              return datasourceGetter(scope, {
                query: query,
                top: top
              }).then(function (items) {
                if (items) {
                  return items.map(function (item) {
                    var result = {
                      type: descriptionGetter && getDescription(item),
                      error: item.error,
                      data: item
                    };

                    result[labelName] = getLabel(item);

                    return result;
                  });
                }

                return [{
                  action: false,
                  error: true,
                  type: descriptionGetter && ($attrs.errorText && $interpolate($attrs.errorText)(scope) || 'error'),
                  label: $attrs.notfoundText && $interpolate($attrs.notfoundText)(scope) || 'No matches found'
                }];
              });
            }
          };
        }
      };
    }]).
    service('resourceDropdownOptions', ['ErrorMessageBundle', function (ErrorMessageBundle) {
      this.createDataSource = function (Resource, fieldName, opt_errMessage) {
        return function (query, top, options) {
          return Resource.query(angular.extend({
            query: query && (query + '* or ' + query),
            fields: 'id,login,name',
            $top: top
          }, options || {})).$promise.then(function (Data) {
              return Data[fieldName];
            }, function (errorResponse) {
              return ErrorMessageBundle.msg(errorResponse, opt_errMessage || 'dropdown-options');
            });
        };
      };
    }]);
})();
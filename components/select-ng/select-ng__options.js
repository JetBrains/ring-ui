var OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+select\s+as\s+(.*?))?(?:\s+describe\sas\s+(.*?))?(?:\s+for\s+)?([\$\w]+)\s+in\s+(.*?)(?:\s+track\sby\s+(.*?))?$/;

var MATCHES = {
  ITEM: 1,
  LABEL: 2,
  SELECTED_LABEL: 3,
  DESCRIPTION: 4,
  OPTION: 5,
  ITEMS: 6,
  TRACK: 7
};

var defaultKeyField = 'key';
var defaultLabelField = 'label';
var defaultSelectedLabelField = 'selectedLabel';
var defaultDescriptionField = 'description';

/* global angular: false */
angular.module('Ring.select.options', [])
  .factory('SelectOptions', function ($parse) {
    var Options = function (scope, optionsString) {
      this.scope = scope;

      var match;
      if (!(match = optionsString.match(OPTIONS_REGEXP))) {
        throw new Error('Bad rgSelect expression format. Expected: [{item}] [[as] item.text] [select as item.selectLabel]' +
        ' [describe as {item.description}] [for] {item} in {items|dataSource(query)} [track by item.id], Received: ' + optionsString);
      }

      this.itemGetter = $parse(match[MATCHES.ITEM]);
      this.labelGetter = (match[MATCHES.LABEL] && $parse(match[MATCHES.LABEL])) || this.itemGetter;
      this.selectedLabelGetter = match[MATCHES.SELECTED_LABEL] && $parse(match[MATCHES.SELECTED_LABEL]);
      this.descriptionGetter = match[MATCHES.DESCRIPTION] && $parse(match[MATCHES.DESCRIPTION]);
      this.optionVariableName = match[MATCHES.OPTION];
      this.datasourceGetter = $parse(match[MATCHES.ITEMS]);
      this.trackByGetter = match[MATCHES.TRACK] && $parse(match[MATCHES.TRACK]);
    };

    Options.prototype.getProperty = function(option, getter) {
      if (getter) {
        var locals = {};
        locals[this.optionVariableName] = option;
        return getter.apply(this, [this.scope, locals]);
      }
    };

    Options.prototype.getKey = function (option) {
      return this.getProperty(option, this.trackByGetter) || option[defaultKeyField];
    };

    Options.prototype.getLabel = function (option) {
      return this.getProperty(option, this.labelGetter) || option[defaultLabelField];
    };

    Options.prototype.getSelectedLabel = function (option) {
      return this.getProperty(option, this.selectedLabelGetter) || option[defaultSelectedLabelField];
    };

    Options.prototype.getDescription = function (option) {
      return this.getProperty(option, this.descriptionGetter) || option[defaultDescriptionField];
    };

    Options.prototype.getOptions = function (query) {
      return this.datasourceGetter(this.scope, {query: query});
    };

    return Options;
  });

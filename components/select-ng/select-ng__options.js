import deepEquals from 'mout/object/deepMatches';

const OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+select\s+as\s+(.*?))?(?:\s+describe\sas\s+(.*?))?(?:\s+for\s+)?([\$\w]+)\s+in\s+(.*?)(?:\s+track\sby\s+(.*?))?$/;

const MATCHES = {
  ITEM: 1,
  LABEL: 2,
  SELECTED_LABEL: 3,
  DESCRIPTION: 4,
  OPTION: 5,
  ITEMS: 6,
  TRACK: 7
};

const defaultKeyField = 'key';
const defaultLabelField = 'label';
const defaultSelectedLabelField = 'selectedLabel';
const defaultDescriptionField = 'description';

/* global angular: false */
angular.module('Ring.select.options', [])
  .factory('SelectOptions', function ($parse) {
    function Options(scope, optionsString) {
      this.scope = scope;

      let match;
      if (!(match = optionsString.match(OPTIONS_REGEXP))) {
        throw new Error('Bad rgSelect expression format. Expected: [{item}] [[as] item.text] [select as item.selectLabel]' +
          ' [describe as {item.description}] [for] {item} in {items|dataSource(query)} [track by item.id], Received: ' + optionsString);
      }

      /**
       * Now we can write only `item.value as item.label for item in items`
       * we can not skip `item.label`
       */
      this.hasItemGetter = Boolean(match[MATCHES.ITEM] && match[MATCHES.LABEL]);

      this.itemGetter = $parse(match[MATCHES.ITEM]);
      this.labelGetter = (match[MATCHES.LABEL] && $parse(match[MATCHES.LABEL])) || this.itemGetter;
      this.selectedLabelGetter = match[MATCHES.SELECTED_LABEL] && $parse(match[MATCHES.SELECTED_LABEL]);
      this.descriptionGetter = match[MATCHES.DESCRIPTION] && $parse(match[MATCHES.DESCRIPTION]);
      this.optionVariableName = match[MATCHES.OPTION];
      this.datasourceGetter = $parse(match[MATCHES.ITEMS]);
      this.trackByGetter = match[MATCHES.TRACK] && $parse(match[MATCHES.TRACK]);
    }

    Options.prototype.getProperty = function (option, getter) {
      if (getter) {
        const locals = {};
        locals[this.optionVariableName] = option;
        return this::getter(this.scope, locals);
      }
    };

    /**
     * @param {Object} option The item from options collection
     * @return {any} The option value
     */
    Options.prototype.getValue = function (option) {
      if (!this.hasItemGetter) {
        return option;
      }

      const value = this.getProperty(option, this.itemGetter);

      return value === undefined ? option : value;
    };

    /**
     * @param {any} value The option value
     * @param {Array} options The list of options
     * @return {Object|undefined} The option object
     */
    Options.prototype.getOptionByValue = function (value, options) {

      /**
       * @param {any} it
       * @return {string} The string representation of the value
       */
      function toString(it) {
        return typeof it === 'object' ? JSON.stringify(it) : String(it);
      }

      if (!this.hasItemGetter) {
        return value;
      }

      const matchedOptions = options.filter(function (option) {
        const optionValue = this.getValue(option);

        if (typeof value === 'object') {
          return deepEquals(optionValue, value);
        }

        return optionValue === value;
      }.bind(this));

      if (matchedOptions.length > 1) {
        throw new Error('Error(rg-select): You can not have two options with same value(' + toString(value) + ')');
      }

      return matchedOptions[0];
    };

    Options.prototype.getKey = function (option) {
      return this.getProperty(option, this.trackByGetter) || option[defaultKeyField] || option;
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

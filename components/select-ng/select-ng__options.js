import deepEquals from 'mout/object/deepMatches';

class Options {
  static OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+select\s+as\s+(.*?))?(?:\s+describe\sas\s+(.*?))?(?:\s+for\s+)?([\$\w]+)\s+in\s+(.*?)(?:\s+track\sby\s+(.*?))?$/;

  static MATCHES = {
    ITEM: 1,
    LABEL: 2,
    SELECTED_LABEL: 3,
    DESCRIPTION: 4,
    OPTION: 5,
    ITEMS: 6,
    TRACK: 7
  };

  static defaultKeyField = 'key';
  static defaultLabelField = 'label';
  static defaultSelectedLabelField = 'selectedLabel';
  static defaultDescriptionField = 'description';

  constructor(scope, optionsString) {
    this.scope = scope;
    const $parse = this.constructor.$parse;
    const MATCHES = this.constructor.MATCHES;

    let match;
    if (!(match = optionsString.match(this.constructor.OPTIONS_REGEXP))) {
      throw new Error('Bad rgSelect expression format. Expected: [{item}] [[as] item.text] [select as item.selectLabel]' +
        ` [describe as {item.description}] [for] {item} in {items|dataSource(query)} [track by item.id], Received: ${optionsString}`);
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
    this.datasourceIsFunction = match[MATCHES.ITEMS].indexOf('(') > 0;
  }

  getProperty(option, getter) {
    if (getter) {
      const locals = {};
      locals[this.optionVariableName] = option;
      return getter.call(this, this.scope, locals);
    }

    return undefined;
  }

  /**
   * @param {Object} option The item from options collection
   * @return {any} The option value
   */
  getValue(option) {
    if (!this.hasItemGetter) {
      return option;
    }

    const value = this.getProperty(option, this.itemGetter);

    return value === undefined ? option : value;
  }

  /**
   * @param {any} value The option value
   * @param {Array} options The list of options
   * @return {Object|undefined} The option object
   */
  getOptionByValue(value, options) {
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

    const matchedOptions = options.filter(option => {
      const optionValue = this.getValue(option);

      if (typeof value === 'object') {
        return deepEquals(optionValue, value);
      }

      return optionValue === value;
    });

    if (matchedOptions.length > 1) {
      throw new Error(`Error(rg-select): You can not have two options with same value(${toString(value)})`);
    }

    return matchedOptions[0];
  }

  getKey(option) {
    return this.getProperty(option, this.trackByGetter) || option[this.constructor.defaultKeyField] || option;
  }

  getLabel(option) {
    const optionStringValue = typeof option === 'string' ? option : null;
    return this.getProperty(option, this.labelGetter) || option[this.constructor.defaultLabelField] || optionStringValue;
  }

  getSelectedLabel(option) {
    return this.getProperty(option, this.selectedLabelGetter) || option[this.constructor.defaultSelectedLabelField];
  }

  getDescription(option) {
    return this.getProperty(option, this.descriptionGetter) || option[this.constructor.defaultDescriptionField];
  }

  getOptions(query, skip) {
    return this.datasourceGetter(this.scope, {query, skip});
  }
}

/* global angular: false */
const angularModule = angular.module('Ring.select.options', []);

// eslint-disable-next-line prefer-arrow-callback
angularModule.factory('SelectOptions', function SelectOptionsFactory($parse) {
  Options.$parse = $parse;
  return Options;
});

export default angularModule.name;

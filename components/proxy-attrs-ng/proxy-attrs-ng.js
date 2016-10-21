/* global angular: false */
const angularModule = angular.module('Ring.proxy-attrs', []);

function proxyAttrs(template, attrsWhitelist) {
  return function copyAtrrs(iElement, iAttrs) {
    const ATTR_PREFIX = 'data-proxy-';
    const VALUE_PREFIX = 'data-proxyvalue-';

    const attrsList = attrsWhitelist || Object.keys(iAttrs.$attr);
    let resultTemplate = template;

    const hasProxyAttrs = template.indexOf(ATTR_PREFIX) !== -1;
    const hasProxyValues = template.indexOf(VALUE_PREFIX) !== -1;

    attrsList.forEach(attrName => {
      if (iAttrs[attrName] !== undefined) {
        const attrLower = iAttrs.$attr[attrName];
        const attrValue = iAttrs[attrName];

        // proxy full attr
        if (hasProxyAttrs) {
          const attrFind = `${ATTR_PREFIX}${attrLower}`.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const attrReplace = `${attrLower}="${attrValue}"`;
          resultTemplate = resultTemplate.replace(RegExp(`${attrFind}(="")*`, 'g'), attrReplace);
        }

        // proxy only values only
        if (hasProxyValues) {
          const valueFind = `${VALUE_PREFIX}${attrLower}`.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          resultTemplate = resultTemplate.replace(RegExp(valueFind, 'g'), attrValue);
        }
      }
    });

    // remove attributes with empty proxy values
    if (hasProxyValues) {
      resultTemplate = resultTemplate.replace(RegExp(`([^\\s]+?)="${VALUE_PREFIX}(.+?)"`, 'g'), '');
    }

    return resultTemplate;
  };
}

angularModule.value('proxyAttrs', proxyAttrs);

export default angularModule.name;

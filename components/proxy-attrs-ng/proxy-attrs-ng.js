/* global angular: false */
const angularModule = angular.module('Ring.proxy-attrs', []);

function proxyAttrs(template, attrsWhitelist) {
  return function copyAtrrs(iElement, iAttrs) {
    const PREFIX = 'data-proxy-';
    const attrsList = attrsWhitelist || Object.keys(iAttrs.$attr);

    attrsList.forEach(attrName => {
      if (iAttrs[attrName] !== undefined) {
        const attrLower = iAttrs.$attr[attrName];
        template = template.replace(`${PREFIX}${attrLower}`, `${attrLower}="${iAttrs[attrName]}"`); // eslint-disable-line no-param-reassign
      }
    });

    return template;
  };
}

angularModule.value('proxyAttrs', proxyAttrs);

export default angularModule.name;

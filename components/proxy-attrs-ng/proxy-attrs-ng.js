/* global angular: false */
const angularModule = angular.module('Ring.proxy-attrs', []);

function proxyAttrs(template, attrsWhitelist) {
  return function copyAtrrs(iElement, iAttrs) {
    const PREFIX = 'data-proxy-';
    const attrsList = attrsWhitelist || Object.keys(iAttrs.$attr);
    let resultTemplate = template;

    attrsList.forEach(attrName => {
      if (iAttrs[attrName] !== undefined) {
        const attrLower = iAttrs.$attr[attrName];
        resultTemplate = resultTemplate.replace(`${PREFIX}${attrLower}`, `${attrLower}="${iAttrs[attrName]}"`);
      }
    });

    return resultTemplate;
  };
}

angularModule.value('proxyAttrs', proxyAttrs);

export default angularModule.name;

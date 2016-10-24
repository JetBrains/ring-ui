/* global angular: false */
const angularModule = angular.module('Ring.proxy-attrs', []);

function proxyAttrs(template, attrsWhitelist) {
  return function copyAtrrs(iElement, iAttrs) {
    const PREFIX = 'data-proxy-';

    const attrsList = attrsWhitelist || Object.keys(iAttrs.$attr);
    let resultTemplate = template;

    const hasProxyValues = /%([^\s]+?)%/.test(resultTemplate);

    attrsList.forEach(attrName => {
      if (iAttrs[attrName] !== undefined) {
        const attrLower = iAttrs.$attr[attrName];
        const attrValue = iAttrs[attrName];

        const attrFind = `${PREFIX}${attrLower}`.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const attrReplace = `${attrLower}="${attrValue}"`;

        resultTemplate = resultTemplate.replace(RegExp(`${attrFind}(="")*`, 'g'), attrReplace);

        if (hasProxyValues) {
          resultTemplate = resultTemplate.replace(new RegExp(`%${attrLower.replace('-', '\\-')}%`, 'g'), attrValue);
        }
      }
    });

    if (hasProxyValues) {
      resultTemplate = resultTemplate.replace(/([^\s]+?)="%([^\s]+?)%"/g, '');
      resultTemplate = resultTemplate.replace(/%([^\s]+?)%/g, '');
    }

    return resultTemplate;
  };
}

angularModule.value('proxyAttrs', proxyAttrs);

export default angularModule.name;

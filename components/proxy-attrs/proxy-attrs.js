function proxyAttrs(template, attrsWhitelist) {
  return function copyAtrrs(iElement, iAttrs) {
    const PREFIX = 'data-proxy-';

    const attrsList = attrsWhitelist || Object.keys(iAttrs.$attr);
    let resultTemplate = template;

    attrsList.forEach(attrName => {
      if (iAttrs[attrName] !== undefined) {
        const attrLower = iAttrs.$attr[attrName];
        const attrValue = iAttrs[attrName];

        const attrFind = `${PREFIX}${attrLower}`.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const attrReplace = `${attrLower}="${attrValue}"`;

        resultTemplate = resultTemplate.replace(RegExp(`${attrFind}(="")*`, 'g'), attrReplace);
      }
    });

    return resultTemplate;
  };
}

export default proxyAttrs;

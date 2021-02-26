function proxyAttrs(template, attrsWhitelist) {
  return function copyAttrs(iElement, iAttrs) {
    var PREFIX = 'data-proxy-';
    var attrsList = attrsWhitelist || Object.keys(iAttrs.$attr);
    var resultTemplate = template;
    attrsList.forEach(function (attrName) {
      if (iAttrs[attrName] !== undefined) {
        var attrLower = iAttrs.$attr[attrName];
        var attrValue = iAttrs[attrName];
        var attrFind = "".concat(PREFIX).concat(attrLower).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var attrReplace = "".concat(attrLower, "=\"").concat(attrValue, "\"");
        resultTemplate = resultTemplate.replace(RegExp("".concat(attrFind, "(=\"\")*"), 'g'), attrReplace);
      }
    });
    return resultTemplate;
  };
}

export default proxyAttrs;

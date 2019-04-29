export const injectStyleSheet = styles => {
  const styleTag = document.createElement('style');
  styleTag.setAttribute('type', 'text/css');
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);
  return styleTag;
};

export const injectRuleSet = (selector, declarations) =>
  injectStyleSheet(`
${selector} {
  ${Object.entries(declarations).map(([property, value]) => `${property}: ${value};`).join(`
  `)}
}`);

export const injectStyleSheet = (styles: string) => {
  const styleTag = document.createElement('style');
  styleTag.setAttribute('type', 'text/css');
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);
  return styleTag;
};

export const injectRuleSet = (selector: string, declarations: Record<string, string>) =>
  injectStyleSheet(`
${selector} {
  ${Object.entries(declarations).map(([property, value]) => `${property}: ${value};`).join(`
  `)}
}`);

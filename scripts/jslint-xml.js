const xmlEscape = s =>
  // eslint-disable-next-line no-control-regex
  `${s}`.replace(/[<>&"'\x00-\x1F\x7F\u0080-\uFFFF]/g, c => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case '"':
        return '&quot;';
      case "'":
        return '&apos;';
      default:
        return `&#${c.charCodeAt(0)};`;
    }
  });

module.exports = results => {
  const files = results.map(file => {
    const warnings = file.warnings.map(({column, line, text}) => {
      const css = file._postcssResult && file._postcssResult.css;
      const lines = (css && css.split('\n')) || [];
      const evidence = lines[line - 1];

      return [
        `<issue line="${line}"`,
        ` char="${column}"`,
        ` evidence="${evidence ? xmlEscape(evidence) : ''}"`,
        ` reason="${xmlEscape(text)}" />`,
      ].join('');
    });

    return `<file name="${file.source}">${warnings.join('')}</file>`;
  });

  return `<?xml version="1.0" encoding="utf-8"?><jslint>${files.join('')}</jslint>`;
};

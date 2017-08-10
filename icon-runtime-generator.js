const pascalCase = require('pascal-case');
const {stringifyRequest} = require('loader-utils');
const {stringifySymbol} = require('svg-sprite-loader/lib/utils');

module.exports = ({symbol, config, context}) => {
  const {spriteModule, symbolModule} = config;

  const spriteRequest = stringifyRequest({context}, spriteModule);
  const symbolRequest = stringifyRequest({context}, symbolModule);
  const displayName = `${pascalCase(symbol.id)}Icon`;

  return `
    import React from 'react';
    import SpriteSymbol from ${symbolRequest};
    import sprite from ${spriteRequest};
    import Icon from '@jetbrains/ring-ui/components/icon/icon';

    const symbol = new SpriteSymbol(${stringifySymbol(symbol)});
    sprite.add(symbol);
    
    const glyph = '#${symbol.id}';
    export const toString = () => glyph;
    const ${displayName} = ({iconRef, ...props}) => (
      <Icon ref={iconRef} {...props} glyph={glyph} />
    );
    Object.assign(${displayName}, Icon, {toString});
    export default ${displayName};
  `;
};

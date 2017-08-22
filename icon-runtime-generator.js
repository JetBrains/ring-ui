const pascalCase = require('pascal-case');
const {stringifyRequest} = require('loader-utils');
const {stringifySymbol} = require('svg-sprite-loader/lib/utils');

module.exports = ({symbol, config, context}) => {
  const {spriteModule, symbolModule} = config;

  const spriteRequest = stringifyRequest({context}, spriteModule);
  const symbolRequest = stringifyRequest({context}, symbolModule);
  const displayName = `${pascalCase(symbol.id)}Icon`;
  const glyph = `#${symbol.id}`;

  return `
    import SpriteSymbol from ${symbolRequest};
    import sprite from ${spriteRequest};
    import {iconHOC} from '@jetbrains/ring-ui/components/icon';

    var symbol = new SpriteSymbol(${stringifySymbol(symbol)});
    sprite.add(symbol);

    export default iconHOC('${glyph}', '${displayName}', true);
    export function toString() {
      return '${glyph}';
    };
  `;
};

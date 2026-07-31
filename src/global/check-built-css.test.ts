import {describe, expect, it} from 'vitest';

// @ts-expect-error importing an untyped CommonJS script
import {findCorruptedCss} from '../../scripts/check-built-css';

const OK = '.ring-button-group-common .ring-button-button:active{z-index:2}';

describe('check-built-css', () => {
  it('passes clean built CSS', () => {
    const css = [
      OK,
      '.ring-button-group-common>button:first-child{margin:0}',
      ':is(.ring-button-group-common .ring-button-button):active{z-index:2}',
      '@media (-ms-high-contrast:none),(-ms-high-contrast:active){.ring-button-button:hover{color:red}}',
      '@keyframes ring-loader-pulse{0%{opacity:0}}',
      '.ring-loader-inline{animation-name:ring-loader-pulse;margin:var(--ring-unit)}',
      '.ring-button-button{animation:ring-loader-pulse 1s linear infinite}',
      ".ring-icon-icon{background:url('data:image/svg+xml;utf8,<svg id=x/>')}",
      '@supports selector(.ring-button-button){.ring-button-button{margin:0}}',
      '@container style(--ring-theme: dark){.ring-button-button{margin:0}}',
    ].join('\n');
    expect(findCorruptedCss(css)).toEqual([]);
  });

  it.each([
    ['pseudo-class', '.ring-button-button:ring-button-active{z-index:2}'],
    ['bare element selector', '.ring-button-group-common ring-button-button{margin:0}'],
    ['bare element after combinator', '.ring-button-group-common>ring-button-button:first-child{margin:0}'],
    ['functional pseudo argument', ':is(ring-button-button){margin:0}'],
    ['media feature value', '@media (-ms-high-contrast:ring-button-active){.ring-button-button{color:red}}'],
    ['attribute selector value', '.ring-button-button[type=ring-button-button]{margin:0}'],
    ['declaration value', '.ring-tooltip-tooltip{content:"ring-button-button"}'],
    ['declaration value alongside url()', '.ring-x-x{cursor:url(cursor.svg),ring-button-pointer}'],
    ['@supports params', '@supports (display:ring-grid-grid){.ring-grid-grid{display:grid}}'],
    ['attribute name', '.ring-button-button[ring-button-disabled]{margin:0}'],
    ['slash-separated declaration value', '.ring-x-x{font:12px/ring-button-normal sans-serif}'],
    ['keyframes step selector', '@keyframes x{ring-button-from{opacity:0}to{opacity:1}}'],
    [
      'animation keyword',
      '@keyframes ring-loader-pulse{0%{opacity:0}}\n.ring-x-x{animation:ring-loader-pulse 1s ring-button-linear}',
    ],
    ['url() payload', '.ring-x-x{background:url(data:ring-icon-image/png;base64,AAA)}'],
    ['dot-prefixed declaration value', '.ring-x-x{content:".ring-button-button"}'],
    ['quoted attribute value', '.ring-x-x[data-class=".ring-button-button"]{margin:0}'],
    ['quoted value in @supports params', '@supports selector([data-class=".ring-button-button"]){.ring-x-x{margin:0}}'],
  ])('rejects corruption in %s', (_name, corrupted) => {
    expect(findCorruptedCss(`${OK}\n${corrupted}`)).not.toEqual([]);
  });

  it('requires button-group :active rules to be present', () => {
    expect(findCorruptedCss('.ring-button-button{color:red}')).not.toEqual([]);
  });
});

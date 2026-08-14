/*
 * RG-2791: CSS-modules `@value` import replacement (icss-utils replaceValueSymbols) renames
 * the imported identifier everywhere in the file, not only in `.class` positions. When an
 * imported value name collides with another ident (`:active` pseudo-class, `button` element
 * selector, `(-ms-high-contrast: active)` media feature value), the built CSS ends up with
 * invalid selectors like `:ring-button-active` or bare `ring-button-button`, and browsers
 * drop those rules entirely. Guard the built stylesheet against that.
 */
/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import {fileURLToPath, pathToFileURL} from 'url';
import {parse} from 'postcss';

// A scoped class name leaking outside class-selector position. In selectors a `ring-*` ident is
// only legitimate right after `.` (class selector); in declaration values only inside a longer
// ident such as `var(--ring-*)` or, for animation properties, as a name actually declared by a
// scoped `@keyframes` in the same stylesheet. Everything else — `:ring-button-active` (was `:active`), bare
// `> ring-button-button` (was `> button`), `:is(ring-x)`, `[ring-x]`, `[type=ring-x]`,
// `12px/ring-x`, `content:'ring-x'` — is corruption left by the CSS-modules @value replacement.
// Potential false positive: an intentional ring-prefixed attribute/string value (e.g.
// `[class~='ring-x']`) would trigger this check — no such CSS exists today; add an allowlist here
// if one ever appears
const LEAK = /(?<![\w.-])ring-[\w-]+/;
// In declaration values a `.` proves nothing (a leaked `content: ".ring-button-button"` would
// still be corruption), so there only longer idents like `var(--ring-*)` are exempt
const VALUE_LEAK = /(?<![\w-])ring-[\w-]+/;

const QUOTED = /'[^']*'|"[^"]*"/g;

// For selectors and at-rule params: the dot exemption only applies outside quoted strings —
// inside quotes (attribute values etc.) a `.ring-*` is as corrupted as anywhere else
const hasSelectorLeak = text =>
  LEAK.test(text.replace(QUOTED, "''")) || (text.match(QUOTED) || []).some(quoted => VALUE_LEAK.test(quoted));

export function findCorruptedCss(css, from) {
  const root = parse(css, {from});
  const errors = [];

  // Scoped @keyframes names are the one place a bare `ring-*` ident is legitimate — collect
  // them so animation declarations can be checked against the actual declared names
  const keyframesNames = new Set();
  root.walkAtRules(/keyframes/i, atRule => keyframesNames.add(atRule.params.trim()));
  const valueLeakGlobal = new RegExp(VALUE_LEAK.source, 'g');
  const stripKeyframesNames = value => value.replace(valueLeakGlobal, name => (keyframesNames.has(name) ? '' : name));

  root.walkRules(rule => {
    // @keyframes step selectors (from/to/%) never contain class names either — a bare
    // `ring-*` there (e.g. `ring-foo-from`) is corruption like anywhere else
    if (hasSelectorLeak(rule.selector)) {
      errors.push(`Corrupted selector: ${rule.selector}`);
    }
  });

  root.walkDecls(decl => {
    const isAnimation = /^(?:-\w+-)?animation(?:-name)?$/.test(decl.prop);
    const value = isAnimation ? stripKeyframesNames(decl.value) : decl.value;
    if (VALUE_LEAK.test(value)) {
      errors.push(`Corrupted declaration value: ${decl.prop}: ${decl.value}`);
    }
  });

  root.walkAtRules(atRule => {
    // scoped @keyframes names legitimately contain "ring-"; in other at-rule params
    // (@media, @supports, @container, ...) apply the same rule as elsewhere: `.ring-*` class
    // selectors and `--ring-*` custom properties are fine, a bare `ring-*` ident is corruption
    if (/keyframes/i.test(atRule.name)) {
      return;
    }
    if (hasSelectorLeak(atRule.params)) {
      errors.push(`Corrupted @${atRule.name} params: ${atRule.params}`);
    }
  });

  // Positive check: button-group :active rules survived the build intact. Tied to
  // button-group.css's current markup — if that file is reworked, this check may start failing
  // as an expected consequence; swap in a different positive check against the new markup.
  let hasButtonGroupActive = false;
  root.walkRules(rule => {
    if (rule.selector.includes('.ring-button-group-') && rule.selector.includes(':active')) {
      hasButtonGroupActive = true;
    }
  });
  if (!hasButtonGroupActive) {
    errors.push('Expected at least one button-group rule with the :active pseudo-class');
  }

  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const stylePath = path.resolve(dirname, '../dist/style.css');
  const errors = findCorruptedCss(fs.readFileSync(stylePath, 'utf-8'), stylePath);

  if (errors.length > 0) {
    console.error(`${stylePath} failed the check:`);
    errors.forEach(error => console.error(`  ${error}`));
    process.exit(1);
  }
  console.log(`${stylePath} passed the corrupted-selectors check`);
}

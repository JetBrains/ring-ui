const {test, describe} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// Requiring the plugin exercises the postcss-modules FileSystemLoader resolution,
// which broke in postcss-modules@9 due to its "exports" map
const cssPlugin = require('./css-plugin');

describe('cssPlugin', () => {
  test('resolves "@value" imports via the custom FileSystemLoader', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'css-plugin-'));
    const valuesFile = path.join(dir, 'values.css');
    const entryFile = path.join(dir, 'entry.css');
    fs.writeFileSync(valuesFile, '@value unit: 8px;\n');
    fs.writeFileSync(entryFile, `@value unit from './values.css';\n.foo { margin: unit; }\n`);

    const plugin = cssPlugin({include: '**/*.css'});
    const result = await plugin.transform(fs.readFileSync(entryFile, 'utf-8'), entryFile);

    assert.ok(result.code.includes('"foo"'), 'entry file should export css-modules mapping');

    const emitted = [];
    await plugin.generateBundle.call({emitFile: asset => emitted.push(asset)});
    const css = emitted[0].source;
    assert.match(css, /margin:\s*8px/, '"@value" import should be resolved to its value');
    assert.match(css, /"@value" import of "values.css" extracted/, 'imported file content should not be inlined');
  });
});

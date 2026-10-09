import {readFileSync} from 'node:fs';
import postcss from 'postcss';

import postcssConfig from '../../postcss.config';

describe('Loader Inline CSS', () => {
  it('should emit a numeric pulse scale for browsers without CSS division support', async () => {
    const from = 'src/loader-inline/loader-inline.css';
    const source = readFileSync(from, 'utf8');
    const {css} = await postcss(postcssConfig().plugins).process(source, {from});

    expect(css).to.contain('transform: scale(1.4167)');
  });
});

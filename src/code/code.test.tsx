import {render, screen} from '@testing-library/react';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';

import Code, {CodeProps, highlight} from './code';

highlight.registerLanguage('css', css);
highlight.registerLanguage('javascript', javascript);
highlight.registerLanguage('xml', xml);

type CodeAttributes = React.JSX.LibraryManagedAttributes<typeof Code, CodeProps>

describe('Code', () => {
  const renderCode = (props?: Omit<CodeAttributes, 'code'> & Partial<Pick<CodeAttributes, 'code'>>) => {
    render(
      <Code
        code=""
        {...props}
      />
    );
    return screen.getByTestId('ring-code');
  };

  it('should wrap children with pre', () => {
    renderCode().should.have.tagName('pre');
  });

  it('should use passed className', () => {
    renderCode({className: 'test-class'}).should.have.class('test-class');
  });

  it('should add passed language to class attribute', () => {
    renderCode({language: 'js'}).should.have.class('js');
  });

  it('should detect javascript/JSX', () => {
    const code = renderCode({
      code: `
        import React, {Component} from 'react';
        import ChildComponent from './child-component';

        const MyComponent = () => (
          <div className="class">
            <ChildComponent prop="value" />
          </div>
        );
      `
    });

    code.should.contain('.javascript');
    code.should.contain('.xml');
  });

  it('should detect CSS', () => {
    const code = renderCode({
      code: `
        .className {
          display: inline-block;
          font-size: 18px;
        }
      `
    });
    code.should.contain('.css');
  });

  it('should detect HTML', () => {
    const code = renderCode({
      code: `
        <body>
          <div id="app"></div>
        </body>
      `
    });
    code.should.contain('.xml');
  });

  it('should parse and highlight the code', () => {
    const code = renderCode({
      code: '"foo"'
    });
    const token = code.querySelector('.hljs-string');
    should.exist(token?.textContent);
    token?.textContent?.should.equal('"foo"');
  });

  it('should parse and highlight the code after props update', () => {
    const {rerender} = render(<Code code="'foo'"/>);
    rerender(<Code code="'bar'"/>);
    const token = document.querySelector('.hljs-string');
    should.exist(token?.textContent);
    token?.textContent?.should.equal("'bar'");
  });
});

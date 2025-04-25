import {render, screen} from '@testing-library/react';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';

import Code, {CodeProps, highlight} from './code';

highlight.registerLanguage('css', css);
highlight.registerLanguage('javascript', javascript);
highlight.registerLanguage('xml', xml);

type CodeAttributes = React.JSX.LibraryManagedAttributes<typeof Code, CodeProps>;

describe('Code', () => {
  const renderCode = (props?: Omit<CodeAttributes, 'code'> & Partial<Pick<CodeAttributes, 'code'>>) => {
    render(<Code code="" {...props} />);
    return screen.getByTestId('ring-code');
  };

  it('should wrap children with pre', () => {
    expect(renderCode()).to.have.tagName('pre');
  });

  it('should use passed className', () => {
    expect(renderCode({className: 'test-class'})).to.have.class('test-class');
  });

  it('should add passed language to class attribute', () => {
    expect(renderCode({language: 'js'})).to.have.class('js');
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
      `,
    });

    expect(code).to.contain('.javascript');
    expect(code).to.contain('.xml');
  });

  it('should detect CSS', () => {
    const code = renderCode({
      code: `
        .className {
          display: inline-block;
          font-size: 18px;
        }
      `,
    });
    expect(code).to.contain('.css');
  });

  it('should detect HTML', () => {
    const code = renderCode({
      code: `
        <body>
          <div id="app"></div>
        </body>
      `,
    });
    expect(code).to.contain('.xml');
  });

  it('should parse and highlight the code', () => {
    const code = renderCode({
      code: '"foo"',
    });
    const token = code.querySelector('.hljs-string');
    expect(token?.textContent).to.exist;
    expect(token?.textContent).to.equal('"foo"');
  });

  it('should parse and highlight the code after props update', () => {
    const {rerender} = render(<Code code="'foo'" />);
    rerender(<Code code="'bar'" />);
    const token = document.querySelector('.hljs-string');
    expect(token?.textContent).to.exist;
    expect(token?.textContent).to.equal("'bar'");
  });
});

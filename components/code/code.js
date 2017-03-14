import React, {PropTypes} from 'react';
import highlight from 'highlight.js';
import jsBeautify from 'js-beautify';

import 'highlight.js/styles/github.css';

/**
 * @name Code
 * @category Components
 * @framework React
 * @constructor
 * @description Shows code block. Highlights [172 languages](https://highlightjs.org/static/demo/). Optionally beautifies JS(X), CSS and HTML.
 * @example
   <example name="code">
     <file name="index.html">
       <div id="code"></div>
     </file>

     <file name="index.js">
       import React from 'react';
       import {render} from 'react-dom';

       import Code from 'ring-ui/components/code/code';

       const container = document.getElementById('code');
       const demo = (
         <Code
           code={`import React from 'react';

import Code from 'ring-ui/components/code/code';

const code = <Code code="some('js');" />;`}
         />
       );

       render(demo, container);
     </file>
   </example>
 */

const Languages = {
  JS: 'js',
  HTML: 'html',
  CSS: 'css',
  SCSS: 'scss'
};

function highlightEl(el) {
  highlight.highlightBlock(el);
}

const Code = ({code, className, language, beautify, beautifyOptions}) => {
  const options = {
    ...Code.defaultProps.beautifyOptions,
    ...beautifyOptions
  };
  const beautifier = beautify && jsBeautify[language];
  const beautified = beautifier ? beautifier(code, options) : code;

  return (
    <pre className={className}>
      <code ref={highlightEl}>{beautified}</code>
    </pre>
  );
};

Code.Languages = Languages;

Code.propTypes = {
  language: PropTypes.string,
  code: PropTypes.string.isRequired,
  className: PropTypes.string,
  beautify: PropTypes.bool,
  beautifyOptions: PropTypes.object
};

Code.defaultProps = {
  language: Languages.js,
  beautify: false,
  beautifyOptions: {
    e4x: true, // support JSX
    indent_size: 2 // eslint-disable-line camelcase
  }
};

export default Code;

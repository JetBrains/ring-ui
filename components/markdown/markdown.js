import React, {PropTypes} from 'react';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';

import 'github-markdown-css/github-markdown.css';
import styles from './markdown.css';

import CodeBlock from './code-block';
import Link from './link';

/**
 * @name Markdown
 * @category Components
 * @framework React
 * @constructor
 * @description Renders Markdown
 * @example
   <example name="markdown">
     <file name="index.html">
       <div id="markdown"></div>
     </file>

     <file name="index.js">
       import React from 'react';
       import {render} from 'react-dom';

       import Markdown from 'ring-ui/components/markdown/markdown';

       const demo = (
         <Markdown
           source={`# Header
## Header
### Header
#### Header

_Various_ types of **highlighting**

[Link](/)

## Code
\`\`\`js
 import React from 'react';

 import Markdown from 'ring-ui/components/markdown/markdown';

 const MarkdownHeader = ({children}) => <Markdown/>#{children}<Markdown/>;
\`\`\``}
         />
       );
       render(demo, document.getElementById('markdown'));
     </file>
   </example>
 */

const Markdown = ({className, renderers, ...restProps}) => (
  <ReactMarkdown
    className={classNames(styles.markdown, 'markdown-body', className)}
    renderers={{
      Link,
      CodeBlock,
      ...renderers
    }}
    {...restProps}
  />
);

Markdown.propTypes = {
  source: PropTypes.string,
  className: PropTypes.string,
  renderers: PropTypes.object
};

export default Markdown;

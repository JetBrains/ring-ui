import React from 'react';

import Markdown from './markdown';

const renderedMarkdown = `
<h1>Header 1</h1>
<h2>Header 2</h2>
<h3>Header 3</h3>
<h4>Header 4</h4>
<p><em>Various</em> types of <strong>highlighting</strong></p>
<p><a href="/">Link</a></p>
<blockquote>
<p>Blockquote</p>
<p>Second line</p>
</blockquote>
<p>Unordered list:</p>
<ul>
<li>List</li>
<li>List</li>
</ul>
<p>Ordered list:</p>
<ol>
<li>One</li>
<li>Two</li>
</ol>
<p>Horizontal line</p>
<hr>
<p>Some <code>inline(code)</code> inside text</p>
<h2>Block code</h2>
<pre class="hljs"><code>import React from 'react';

import {md} from '@jetbrains/ring-ui/components/markdown/markdown';

const MarkdownHeader = ({children}) =&gt; md\`#$\{children\}\`;
</code></pre>`;

export default {
  title: 'Components/Markdown',

  parameters: {
    notes: 'Renders Markdown.'
  }
};

export const basic = () => (
  <Markdown>
    {/*
        Note: it is up to developer to pick the best option fore markdown rendering
        We suggest using `markdown-it` or `react-markdown`
        Be careful with passing user input down to `dangerouslySetInnerHTML`!
   */}
    <div dangerouslySetInnerHTML={{__html: renderedMarkdown}}/>
  </Markdown>
);

basic.storyName = 'basic';

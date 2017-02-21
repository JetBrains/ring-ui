import React, {PureComponent, PropTypes} from 'react';

import highlight from 'highlight.js';
import 'highlight.js/styles/github.css';
import beautify from 'js-beautify';

const beautifyOptions = {
  e4x: true, // support JSX
  indent_size: 2 // eslint-disable-line camelcase
};

const beautifyLangMap = {
  js: 'js',
  html: 'html',
  css: 'css',
  scss: 'css'
};

export default class Code extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    attrs: PropTypes.shape({
      'show-code': PropTypes.boolean
    }),
    content: PropTypes.string
  };

  codeRef = el => {
    const code = el.textContent;
    const {type} = this.props;

    el.textContent = (type in beautifyLangMap)
      ? beautify[beautifyLangMap[type]](code, beautifyOptions)
      : code;

    highlight.highlightBlock(el);
  };

  render() {
    return (
      <div className="markdown-example-code">
        <pre><code ref={this.codeRef}>{this.props.content}</code></pre>
      </div>
    );
  }
}

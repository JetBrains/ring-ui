import React, {PureComponent, PropTypes} from 'react';
import highlight from 'highlight.js';

import 'highlight.js/styles/github.css';

import normalizeIndent from '../global/normalize-indent';
import trivialTemplateTag from '../global/trivial-template-tag';

/**
 * @name Code
 * @category Components
 * @framework React
 * @constructor
 * @description Shows code block. Highlights [172 languages](https://highlightjs.org/static/demo/). Optionally beautifies JS(X), CSS and HTML.
 * @example-file ./code.examples.html
 */

export default class Code extends PureComponent {
  static propTypes = {
    code: PropTypes.string.isRequired,
    inline: PropTypes.bool,
    className: PropTypes.string
  };

  static defaultProps = {
    inline: false
  };

  highlightEl = el => {
    if (el && !this.props.inline) {
      highlight.highlightBlock(el);
    }
  }

  render() {
    const {code, className, inline} = this.props;

    const Tag = inline ? 'span' : 'pre';

    return (
      <Tag className={className}>
        <code ref={this.highlightEl}>{normalizeIndent(code)}</code>
      </Tag>
    );
  }
}

const code = trivialTemplateTag(source => <Code code={source}/>);

export {code};

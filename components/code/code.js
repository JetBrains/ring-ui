import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import highlight from 'highlight.js';
import classnames from 'classnames';

import 'highlight.js/styles/github.css';

import normalizeIndent from '../global/normalize-indent';
import trivialTemplateTag from '../global/trivial-template-tag';

import styles from './code.css';

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
    className: PropTypes.string,
    code: PropTypes.string.isRequired,
    inline: PropTypes.bool,
    language: PropTypes.string
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
    const {code, className, inline, language} = this.props;

    const Tag = inline ? 'span' : 'pre';
    const classes = classnames(styles.code, className, language, {
      [styles.inline]: inline
    });

    return (
      <Tag className={classes}>
        <code ref={this.highlightEl}>{normalizeIndent(code)}</code>
      </Tag>
    );
  }
}

const code = trivialTemplateTag(source => <Code code={source}/>);

export {code};

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import normalizeIndent from '../global/normalize-indent';
import trivialTemplateTag from '../global/trivial-template-tag';

import highlight from './highlight';
import styles from './code.css';

function noop() {}

/**
 * @name Code
 * @category Components
 * @tags Ring UI Language
 * @framework React
 * @constructor
 * @description Shows a block of code. By default highlights following languages: _cpp, xml, bash, clojure, coffeescript, cs, css, markdown, dockerfile, elixir, elm, ruby, erlang, glsl, go, gradle, groovy, handlebars, haskell, ava, javascript, json, kotlin, less, livescript, lua, makefile, perl, php, powershell, python, r, rust, scala, scss, shell, sql, swift, yaml, twig, typescript_.
 * But it's possible to enable support for  other languages manually:
 * ```
 * import {highlight} from '@jetbrains/ring-ui/components/code/code'
 * import 1c from 'highlight.js/lib/languages/1c';
 * highlight.registerLanguage('1c', 1c);
 * ```
 * @example-file ./code.examples.html
 */

export default class Code extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    code: PropTypes.string.isRequired,
    inline: PropTypes.bool,
    language: PropTypes.string,
    replacer: PropTypes.func
  };

  static defaultProps = {
    inline: false,
    replacer: noop
  };

  componentDidMount() {
    this.highlight();
  }

  componentDidUpdate() {
    this.highlight();
  }

  highlight() {
    if (!this.props.inline) {
      highlight.highlightBlock(this.code);
    }
    this.props.replacer(this.code);
  }

  codeRef = el => {
    this.code = el;
  };

  render() {
    const {code, className, inline, language} = this.props;

    const Tag = inline ? 'span' : 'pre';
    const classes = classNames(styles.code, className, language, {
      [styles.inline]: inline
    });

    return (
      <Tag className={classes}>
        <code ref={this.codeRef}>{normalizeIndent(code)}</code>
      </Tag>
    );
  }
}

const code = trivialTemplateTag(source => <Code code={source}/>);

export {code, highlight};

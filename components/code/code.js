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
 * @description Displays a block of code. Syntax highlighting is available by default for the following languages: _cpp, xml, bash, clojure, coffeescript, cs, css, markdown, dockerfile, elixir, elm, ruby, erlang, glsl, go, gradle, groovy, handlebars, haskell, ava, javascript, json, kotlin, less, livescript, lua, makefile, perl, php, powershell, python, r, rust, scala, scss, shell, sql, swift, yaml, twig, typescript_.
 * Highlighting of other languages is available as well:
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
    softWrap: PropTypes.bool,
    language: PropTypes.string,
    replacer: PropTypes.func,
    codeRef: PropTypes.shape({current: PropTypes.instanceOf(Element)})
  };

  static defaultProps = {
    inline: false,
    softWrap: false,
    replacer: noop
  };

  constructor(props) {
    super(props);
    this.defaultCodeRef = React.createRef();
  }

  componentDidMount() {
    this.highlight();
  }

  componentDidUpdate() {
    this.highlight();
  }

  highlight() {
    if (!this.props.inline) {
      highlight.highlightBlock(this.codeRef.current);
    }
    this.props.replacer(this.codeRef.current);
  }

  get codeRef() {
    return this.props.codeRef ? this.props.codeRef : this.defaultCodeRef;
  }

  render() {
    const {code, className, inline, softWrap, language} = this.props;

    const Tag = inline ? 'span' : 'pre';
    const classes = classNames(styles.code, className, language, {
      [styles.inline]: inline,
      [styles.softWrap]: softWrap
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

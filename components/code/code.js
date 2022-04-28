import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import highlight from 'highlight.js/lib/core';

import normalizeIndent from '../global/normalize-indent';
import trivialTemplateTag from '../global/trivial-template-tag';
import memoize from '../global/memoize';

import styles from './code.css';
import highlightStyles from './highlight.css';

function noop() {}

const registerLanguage = memoize(async language => {
  const languageExports = await import(
    /* webpackChunkName: "highlight-[request]" */
    `highlight.js/lib/languages/${language}`
  );
  highlight.registerLanguage(language, languageExports.default);
});

/**
 * @name Code
 */

export default class Code extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    code: PropTypes.string.isRequired,
    inline: PropTypes.bool,
    softWrap: PropTypes.bool,
    language: PropTypes.string,
    replacer: PropTypes.func,
    codeRef: PropTypes.oneOfType([
      PropTypes.shape({current: PropTypes.instanceOf(Element)}),
      PropTypes.func
    ])
  };

  static defaultProps = {
    inline: false,
    softWrap: false,
    replacer: noop
  };

  componentDidMount() {
    this.highlight();
  }

  componentDidUpdate() {
    this.highlight();
  }

  async highlight() {
    const codeRef = this.codeRef;
    if (codeRef == null) {
      return;
    }
    const {language, inline, replacer} = this.props;
    if (!inline) {
      if (language != null && highlight.getLanguage(language) == null) {
        await registerLanguage(language);
      }
      highlight.highlightElement(codeRef);
    }
    replacer(codeRef);
  }

  get codeRef() {
    const {codeRef} = this.props;
    return !codeRef || this.isFunctionCodeRef ? this.code : codeRef.current;
  }

  get isFunctionCodeRef() {
    return typeof (this.props.codeRef) === 'function';
  }

  get initCodeRef() {
    const {codeRef} = this.props;
    if (codeRef && !this.isFunctionCodeRef) {
      return codeRef;
    }
    return ref => {
      this.code = ref;
      if (this.isFunctionCodeRef) {
        codeRef(this.code);
      }
    };
  }

  render() {
    const {code, className, inline, softWrap, language} = this.props;

    const Tag = inline ? 'span' : 'pre';
    const classes = classNames(styles.code, className, language, {
      [styles.inline]: inline,
      [styles.softWrap]: softWrap
    });

    return (
      <Tag className={classes} data-test="ring-code">
        <code
          // should be focusable because it can be scrollable
          tabIndex={inline ? -1 : 0}
          ref={this.initCodeRef}
          className={highlightStyles.highlightContainer}
        >
          {normalizeIndent(code)}
        </code>
      </Tag>
    );
  }
}

const code = trivialTemplateTag(source => <Code code={source}/>);

export {code, highlight};

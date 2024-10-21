import {PureComponent, Ref} from 'react';
import classNames from 'classnames';
import highlight from 'highlight.js/lib/core';

import normalizeIndent from '../global/normalize-indent';
import trivialTemplateTag from '../global/trivial-template-tag';
import memoize from '../global/memoize';

import styles from './code.css';
import highlightStyles from './highlight.css';

function noop() {}

const registerLanguage = memoize(async (language: string) => {
  const languageExports = await import(
    /* webpackChunkName: "highlight-[request]" */
    `highlight.js/lib/languages/${language}`
  );
  highlight.registerLanguage(language, languageExports.default);
});

export interface CodeProps {
  code: string;
  inline: boolean;
  softWrap: boolean;
  replacer: (element: HTMLElement | null) => void;
  className?: string | null | undefined;
  language?: string | null | undefined;
  codeRef?: Ref<HTMLElement> | null | undefined;
}

/**
 * @name Code
 */

export default class Code extends PureComponent<CodeProps> {
  static defaultProps = {
    inline: false,
    softWrap: false,
    replacer: noop,
  };

  componentDidMount() {
    this.highlight();
  }

  componentDidUpdate() {
    this.highlight();
  }

  code?: HTMLElement | null;

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
      // @ts-expect-error https://github.com/highlightjs/highlight.js/issues/2945
      highlight.highlightElement(codeRef);
    }
    replacer(codeRef);
  }

  get codeRef() {
    const {codeRef} = this.props;
    return !codeRef || typeof codeRef === 'function' ? this.code : codeRef.current;
  }

  get initCodeRef() {
    const {codeRef} = this.props;
    const isFunctionCodeRef = typeof codeRef === 'function';
    if (codeRef && !isFunctionCodeRef) {
      return codeRef;
    }
    return (ref: HTMLElement | null) => {
      this.code = ref;
      if (isFunctionCodeRef) {
        codeRef(this.code);
      }
    };
  }

  render() {
    const {code, className, inline, softWrap, language} = this.props;

    const Tag = inline ? 'span' : 'pre';
    const classes = classNames(styles.code, className, language, {
      [styles.inline]: inline,
      [styles.softWrap]: softWrap,
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

const code = trivialTemplateTag((source: string) => <Code code={source} />);

export {code, highlight};

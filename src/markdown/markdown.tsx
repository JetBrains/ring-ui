import React, {ComponentType, PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown, {Options} from 'react-markdown';
import classNames from 'classnames';
import RemarkBreaks from 'remark-breaks';
import RemarkGFM from 'remark-gfm';

import normalizeIndent from '../global/normalize-indent';
import trivialTemplateTag from '../global/trivial-template-tag';

import Code from './code';
import Link from './link';
import Heading from './heading';
import styles from './markdown.css';

export interface BaseMarkdownProps {
  inline?: boolean | null | undefined
}

export type MarkdownProps = Options & BaseMarkdownProps

/**
  * @name Markdown
*/

export default class Markdown extends PureComponent<MarkdownProps> {
  render() {
    const {className, components, inline, children, plugins = [], ...restProps} = this.props;

    const classes = classNames(className, {
      [styles.markdown]: !inline,
      [styles.inline]: inline
    });

    return (
      <ReactMarkdown
        className={classes}
        plugins={[RemarkBreaks, RemarkGFM, ...plugins]}
        components={{
          a: Link,
          code: Code,
          h1: Heading,
          h2: Heading,
          h3: Heading,
          h4: Heading,
          h5: Heading,
          h6: Heading,
          ...components
        }}
        {...restProps}
      >{normalizeIndent(children)}</ReactMarkdown>
    );
  }
}

(Markdown as ComponentType<unknown>).propTypes = {
  inline: PropTypes.bool,
  children: PropTypes.string,
  className: PropTypes.string,
  components: PropTypes.object,
  plugins: PropTypes.array
};

const md = trivialTemplateTag(source => <Markdown>{source}</Markdown>);

export {md};

import React, {ComponentType, PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown, {ReactMarkdownProps} from 'react-markdown';
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
  source: string
  inline?: boolean | null | undefined
}

export type MarkdownProps = ReactMarkdownProps & BaseMarkdownProps

/**
  * @name Markdown
*/

export default class Markdown extends PureComponent<MarkdownProps> {
  render() {
    const {className, renderers, inline, source, plugins = [], ...restProps} = this.props;

    const classes = classNames(className, {
      [styles.markdown]: !inline,
      [styles.inline]: inline
    });

    return (
      <ReactMarkdown
        className={classes}
        source={normalizeIndent(source)}
        plugins={[RemarkBreaks, RemarkGFM, ...plugins] as ReactMarkdownProps['plugins']}
        renderers={{
          link: Link,
          linkReference: Link,
          code: Code,
          inlineCode: Code,
          heading: Heading,
          ...renderers
        }}
        {...restProps}
      />
    );
  }
}

(Markdown as ComponentType<unknown>).propTypes = {
  inline: PropTypes.bool,
  source: PropTypes.string,
  className: PropTypes.string,
  renderers: PropTypes.object,
  plugins: PropTypes.array
};

const md = trivialTemplateTag(source => <Markdown {...{source}}/>);

export {md};

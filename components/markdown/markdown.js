import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';

import styles from './markdown.css';

import normalizeIndent from '../global/normalize-indent';
import trivialTemplateTag from '../global/trivial-template-tag';

import Code from './code';
import Link from './link';
import Image from './image';
import Heading from './heading';

/**
  * @name Markdown
  * @category Components
  * @tags 3.0
  * @framework React
  * @constructor
  * @description Renders Markdown
  * @example-file ./markdown.examples.html
*/

export default class Markdown extends PureComponent {
  static propTypes = {
    inline: PropTypes.bool,
    source: PropTypes.string,
    className: PropTypes.string,
    renderers: PropTypes.object
  };

  render() {
    const {className, renderers, inline, source, ...restProps} = this.props;

    const classes = classNames(className, {
      [styles.markdown]: !inline
    });

    return (
      <ReactMarkdown
        className={classes}
        source={normalizeIndent(source)}
        renderers={{
          Link,
          Code,
          CodeBlock: Code,
          Image,
          Heading,
          ...renderers
        }}
        {...restProps}
      />
    );
  }
}

const md = trivialTemplateTag(source => <Markdown {...{source}}/>);

export {md};

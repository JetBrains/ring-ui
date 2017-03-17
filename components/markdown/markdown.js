import React, {PureComponent, PropTypes} from 'react';
import ReactMarkdown from 'react-markdown';
import classNames from 'classnames';

import 'github-markdown-css/github-markdown.css';
import styles from './markdown.css';

import normalizeIndent from '../global/normalize-indent';
import trivialTemplateTag from '../global/trivial-template-tag';

import Code from './code';
import Link from './link';

/**
  * @name Markdown
  * @category Components
  * @framework React
  * @constructor
  * @description Renders Markdown
  * @example-file ./markdown.examples.html
*/

export default class Markdown extends PureComponent {
  static propTypes = {
    githubStyled: PropTypes.bool,
    source: PropTypes.string,
    className: PropTypes.string,
    renderers: PropTypes.object
  };

  static defaultProps = {
    githubStyled: true
  };

  render() {
    const {className, renderers, githubStyled, source, ...restProps} = this.props;

    const classes = classNames(className, {
      [styles.markdown]: githubStyled
    });

    return (
      <ReactMarkdown
        className={classes}
        source={normalizeIndent(source)}
        renderers={{
          Link,
          Code,
          CodeBlock: Code,
          ...renderers
        }}
        {...restProps}
      />
    );
  }
}

const md = trivialTemplateTag(source => <Markdown {...{source}}/>);

export {styles, md};

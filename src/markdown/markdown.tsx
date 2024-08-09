import {PureComponent, ReactNode} from 'react';
import classNames from 'classnames';

import headingStyles from '../heading/heading.css';
import linkStyles from '../link/link.css';

import styles from './markdown.css';

export interface MarkdownProps {
  inline?: boolean | null | undefined
  children: ReactNode
  className?: string | null | undefined
}

/**
  * @name Markdown
*/

export default class Markdown extends PureComponent<MarkdownProps> {
  render() {
    const {className, children, inline} = this.props;

    const classes = classNames(className,
      headingStyles.contentWithHeadings,
      linkStyles.withLinks,
      {
        [styles.markdown]: !inline,
        [styles.inline]: inline
      }
    );

    return (
      <div className={classes}>
        {children}
      </div>
    );
  }
}

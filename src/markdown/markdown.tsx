import {type ReactNode} from 'react';
import classNames from 'classnames';

import headingStyles from '../heading/heading.css';
import linkStyles from '../link/link.css';
import styles from './markdown.css';

export interface MarkdownProps {
  inline?: boolean | null | undefined;
  children: ReactNode;
  className?: string | null | undefined;
}

// TODO rename the component to the more clear name in the future releases (e.g. `MarkdownView`)
/**
 * @name Markdown
 */
const Markdown = ({className, children, inline}: MarkdownProps) => {
  const classes = classNames(className, headingStyles.contentWithHeadings, linkStyles.withLinks, {
    [styles.markdown]: !inline,
    [styles.inline]: inline,
  });

  return (
    <div data-test='ring-markdown' className={classes}>
      {children}
    </div>
  );
};

export default Markdown;

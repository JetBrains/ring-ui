/**
 * @name Footer
 */
import React, {
  memo,
  isValidElement,
  ReactNode,
  ComponentType,
  HTMLAttributeAnchorTarget, ReactChild
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Link from '../link/link';

import styles from './footer.css';

type Position = 'left' | 'center' | 'right'

interface FooterColumnProps {
  position: Position
  children: ReactNode
}

const FooterColumn = memo(function FooterColumn({position, children}: FooterColumnProps) {
  const classes = classNames({
    [styles.columnLeft]: position === 'left',
    [styles.columnCenter]: position === 'center',
    [styles.columnRight]: position === 'right'
  });
  return (
    <div className={classes}>
      <ul className={styles.columnItem}>
        {children}
      </ul>
    </div>
  );
});
(FooterColumn as ComponentType<FooterColumnProps>).propTypes = {
  position: PropTypes.oneOf(['left', 'center', 'right'] as const).isRequired,
  children: PropTypes.node
};

/**
 * Return copyright string
 * @param year {int}
 * @returns {string}
 */
export function copyright(year: number) {
  const currentYear = (new Date()).getUTCFullYear();
  const ndash = '–';
  let ret = 'Copyright © ';

  if (year >= currentYear) {
    ret += year;
  } else {
    ret += year + ndash + currentYear;
  }

  return ret;
}

export interface FooterLinkItem {
  copyright?: number | null | undefined
  label?: string | null | undefined
  url?: string | null | undefined
  target?: HTMLAttributeAnchorTarget | undefined
  title?: string | undefined
}

type FooterItem = FooterLinkItem | ReactChild

interface FooterLineProps {
  item: FooterItem | readonly FooterItem[]
}

/**
 * @constructor
 * @extends {ReactComponent}
 */
const FooterLine = memo(function FooterLine(props: FooterLineProps) {
  const items = Array.isArray(props.item) ? props.item : [props.item];

  function renderItem(item: FooterItem) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (isValidElement<any>(item) || typeof item !== 'object') {
      return item;
    }

    const element = (item.copyright ? copyright(item.copyright) : '') + (item.label || item);

    if (item.url) {
      return (
        <Link
          href={item.url}
          target={item.target}
          key={item.url + item.title}
          title={item.title}
        >{element}</Link>
      );
    }

    return element;
  }

  return (
    <li className={styles.line}>
      {items.map(renderItem)}
    </li>
  );
});
(FooterLine as unknown as ComponentType<unknown>).propTypes = {
  item: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string
  ])
};

type FooterItems = readonly (FooterItem | readonly FooterItem[])[]

export interface FooterProps {
  className?: string | null | undefined
  floating?: boolean | null | undefined
  left?: FooterItems | null | undefined
  center?: FooterItems | null | undefined
  right?: FooterItems | null | undefined
}

const Footer = memo(function Footer({floating, className, left, center, right}: FooterProps) {
  function content(elements: FooterItems | null | undefined, position: Position) {
    if (!elements) {
      return false;
    }

    return (
      <FooterColumn
        key={position}
        position={position}
      >
        {elements.map((item, idx) => (
          <FooterLine
            // eslint-disable-next-line react/no-array-index-key
            key={idx}
            item={item}
          />
        ))}
      </FooterColumn>
    );
  }

  const classes = classNames(styles.footer, className, {
    [styles.footerFloating]: floating
  });

  return (
    <footer
      className={classes}
      data-test="ring-footer"
    >{
        [
          content(left, 'left'),
          content(center, 'center'),
          content(right, 'right')
        ]
      }</footer>
  );
});
(Footer as ComponentType<FooterProps>).propTypes = {
  className: PropTypes.string,
  floating: PropTypes.bool,
  left: PropTypes.array,
  center: PropTypes.array,
  right: PropTypes.array
};
export default Footer;

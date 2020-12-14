/**
 * @name Footer
 */
import React, {memo, isValidElement} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Link from '../link/link';

import styles from './footer.css';

const FooterColumn = memo(function FooterColumn({position, children}) {
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
FooterColumn.propTypes = {
  position: PropTypes.string,
  children: PropTypes.node
};

/**
 * Return copyright string
 * @param year {int}
 * @returns {string}
 */
export function copyright(year) {
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

/**
 * @constructor
 * @extends {ReactComponent}
 */
const FooterLine = memo(function FooterLine(props) {
  const items = Array.isArray(props.item) ? props.item : [props.item];

  function renderItem(item) {
    if (isValidElement(item)) {
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
FooterLine.propTypes = {
  item: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string
  ])
};

const Footer = memo(function Footer({floating, className, left, center, right}) {
  function content(elements, position) {
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
Footer.propTypes = {
  className: PropTypes.string,
  floating: PropTypes.bool,
  left: PropTypes.array,
  center: PropTypes.array,
  right: PropTypes.array
};
export default Footer;

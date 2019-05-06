/**
 * @name Footer
 */

/* eslint-disable react/no-multi-comp */

import 'dom4';
import React, {PureComponent, isValidElement} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Link from '../link/link';

import styles from './footer.css';

/**
 * @constructor
 * @extends {ReactComponent}
 */
class FooterColumn extends PureComponent {
  static propTypes = {
    position: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {position, children} = this.props;
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
  }
}

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
class FooterLine extends PureComponent {
  static propTypes = {
    item: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
      PropTypes.string
    ])
  };

  render() {
    const items = Array.isArray(this.props.item) ? this.props.item : [this.props.item];

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
  }
}

export default class Footer extends PureComponent {
  /** @override */
  static propTypes = {
    className: PropTypes.string,
    floating: PropTypes.bool,
    left: PropTypes.array,
    center: PropTypes.array,
    right: PropTypes.array
  };

  render() {
    const {floating} = this.props;

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

    const classes = classNames(styles.footer, this.props.className, {
      [styles.footerFloating]: floating
    });

    return (
      <div
        className={classes}
        data-test="ring-footer"
      >{
          [
            content(this.props.left, 'left'),
            content(this.props.center, 'center'),
            content(this.props.right, 'right')
          ]
        }</div>
    );
  }
}

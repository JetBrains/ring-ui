import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import memoize from '../global/memoize';

import Theme from '../global/theme';

import Link from '../link/link';

import styles from './tabs.css';

import Tab from './tab';

export const CustomItem = ({children}) => children;
CustomItem.propTypes = {
  children: PropTypes.node.isRequired
};

export default class Tabs extends PureComponent {
  static Theme = Theme;
  static propTypes = {
    theme: PropTypes.string,
    selected: PropTypes.string,
    className: PropTypes.string,
    href: PropTypes.string,
    children: PropTypes.node.isRequired,
    onSelect: PropTypes.func
  };

  static defaultProps = {
    theme: Theme.LIGHT,
    onSelect() {}
  };

  handleSelect = memoize(key => () => this.props.onSelect(key));

  getTabTitleCaption(title, isSelected) {
    const renderedTitle = Tab.renderTitle(title, isSelected);
    return (
      <>
        <span className={styles.visible}>{renderedTitle}</span>
        {/* hack for preserving constant tab width*/}
        <span className={styles.hidden}>{renderedTitle}</span>
      </>
    );
  }

  getTabTitle = (child, i) => {
    if (child == null || typeof child !== 'object' || child.type === CustomItem) {
      return child;
    }

    const {selected} = this.props;
    const {title, id, disabled, href} = child.props;
    const key = id || String(i);
    const isSelected = key === selected;
    const titleClasses = classNames(styles.title, {
      [styles.selected]: isSelected
    });

    return (
      <Link
        active
        key={key}
        href={href}
        innerClassName={titleClasses}
        className={titleClasses}
        disabled={disabled}
        onPlainLeftClick={this.handleSelect(key)}
      >{() => this.getTabTitleCaption(title, isSelected)}</Link>
    );
  };

  render() {
    const {className, children, selected, theme} = this.props;
    const classes = classNames(styles.tabs, className, styles[theme]);
    const childrenArray = React.Children.toArray(children).filter(Boolean);

    return (
      <div className={classes}>
        <div className={styles.titles}>
          {childrenArray.map(this.getTabTitle)}
        </div>
        <div className={styles.tab}>
          {childrenArray.find(({props}, i) => (props.id || String(i)) === selected)}
        </div>
      </div>
    );
  }
}

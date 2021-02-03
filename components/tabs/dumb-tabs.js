import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import memoize from '../global/memoize';

import Theme, {withTheme} from '../global/theme';
import dataTests from '../global/data-tests';

import styles from './tabs.css';

import TabLink from './tab-link';
import AutocollapseTabs from './tab-autocollapse-titles';

export const CustomItem = ({children}) => children;
CustomItem.propTypes = {
  children: PropTypes.node.isRequired
};

class Tabs extends PureComponent {
  static propTypes = {
    theme: PropTypes.string,
    selected: PropTypes.string,
    className: PropTypes.string,
    href: PropTypes.string,
    moreClassName: PropTypes.string,
    moreActiveClassName: PropTypes.string,
    morePopupClassName: PropTypes.string,
    children: PropTypes.node.isRequired,
    onSelect: PropTypes.func,
    'data-test': PropTypes.string,
    autoCollapse: PropTypes.bool
  };

  static defaultProps = {
    onSelect() {}
  };

  static Theme = Theme;

  handleSelect = memoize(key => () => this.props.onSelect(key));

  getTabTitle = (child, i) => {
    if (child == null || typeof child !== 'object' || child.type === CustomItem) {
      return child;
    }

    const {selected} = this.props;
    const {title, id, disabled, href, className, activeClassName} = child.props;
    const key = id || String(i);
    const isSelected = key === selected;
    const titleClasses = classNames(
      styles.title,
      className,
      isSelected && activeClassName,
      {
        [styles.selected]: isSelected
      }
    );

    return (
      <TabLink
        title={title}
        isSelected={isSelected}
        active
        key={key}
        href={href}
        innerClassName={titleClasses}
        className={titleClasses}
        disabled={disabled}
        onPlainLeftClick={this.handleSelect(key)}
      />
    );
  };

  render() {
    const {className, children, selected, theme, autoCollapse, 'data-test': dataTest} = this.props;
    const classes = classNames(styles.tabs, className, styles[theme]);
    const childrenArray = React.Children.toArray(children).filter(Boolean);

    return (
      <div className={classes} data-test={dataTests('ring-dumb-tabs', dataTest)}>
        {autoCollapse === true
          ? (
            <AutocollapseTabs
              onSelect={this.handleSelect}
              selected={selected}
              moreClassName={this.props.moreClassName}
              moreActiveClassName={this.props.moreActiveClassName}
              morePopupClassName={this.props.morePopupClassName}
            >{childrenArray}</AutocollapseTabs>
          )
          : (
            <div className={styles.titles}>
              {childrenArray.map(this.getTabTitle)}
            </div>
          )}
        <div className={styles.tab}>
          {childrenArray.find(({props}, i) => (props.id || String(i)) === selected)}
        </div>
      </div>
    );
  }
}
export default withTheme()(Tabs);

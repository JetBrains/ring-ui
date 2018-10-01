import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import memoize from '../global/memoize';

import Theme from '../global/theme';

import styles from './tabs.css';
import Tab from './tab';

export default class Tabs extends PureComponent {
  static Theme = Theme;
  static propTypes = {
    theme: PropTypes.string,
    selected: PropTypes.string,
    className: PropTypes.string,
    href: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element
    ]).isRequired,
    onSelect: PropTypes.func
  };

  static defaultProps = {
    theme: Theme.LIGHT,
    onSelect() {}
  };

  handleSelect = memoize(key => () => this.props.onSelect(key));

  getTabTitleCaption = (title, isSelected) => {
    const renderTitle = () => Tab.renderTitle(title, isSelected);
    return (
      <>
        <span className={styles.visible}>{renderTitle()}</span>
        {/* hack for preserving constant tab width*/}
        <span className={styles.hidden}>{renderTitle()}</span>
      </>
    );
  };

  getTabTitle = (props, i) => {
    const {selected} = this.props;
    // eslint-disable-next-line
    const {title, id, disabled, href} = props;
    const key = id || String(i);
    const isSelected = key === selected;
    const titleClasses = classNames(styles.title, {
      [styles.selected]: isSelected
    });

    const tabCaption = this.getTabTitleCaption(title, isSelected);

    return (href
      ? (
        <a
          key={key}
          href={href}
          className={titleClasses}
          disabled={disabled}
          onClick={this.handleSelect(key)}
        >{tabCaption}</a>
      ) : (
        <button
          type="button"
          key={key}
          className={titleClasses}
          disabled={disabled}
          onClick={this.handleSelect(key)}
        >{tabCaption}</button>
      ));
  };

  render() {
    const {className, children, selected, theme} = this.props;
    const classes = classNames(styles.tabs, className, styles[theme]);
    const childrenArray = React.Children.toArray(children).filter(Boolean);

    return (
      <div className={classes}>
        <div className={styles.titles}>
          {childrenArray.map(({props}, i) => this.getTabTitle(props, i))}
        </div>
        <div className={styles.tab}>
          {childrenArray.filter(({props}, i) => (props.id || String(i)) === selected)[0]}
        </div>
      </div>
    );
  }
}

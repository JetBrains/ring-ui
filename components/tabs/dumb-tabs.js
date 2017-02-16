import React, {PropTypes} from 'react';
import classNames from 'classnames';

import RingComponent from '../ring-component/ring-component';

import styles from './tabs.css';
import Tab from './tab';

/**
 * @name Tabs
 * @category Components
 * @framework React
 * @constructor
 * @description Displays a tab set
 * @example-file ./tabs.examples.html
 */

export default class Tabs extends RingComponent {
  static propTypes = {
    selected: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    onSelect: PropTypes.func
  }

  static defaultProps = {
    onSelect() {}
  }

  render() {
    const {className, children, selected, onSelect} = this.props;
    const classes = classNames(styles.tabs, className);

    return (
      <div className={classes}>
        <div className={styles.titles}>
          {children.map(({props}, i) => {
            const {title, id, disabled} = props;
            const key = id || String(i);
            const isSelected = key === selected;
            const titleClasses = classNames(styles.title, {
              [styles.selected]: isSelected
            });

            const renderTitle = () => Tab.renderTitle(title, isSelected);

            return (
              <div
                key={key}
                className={titleClasses}
                disabled={disabled}
                onClick={() => onSelect(key)}
              >
                <span className={styles.visible}>{renderTitle()}</span>
                {/* hack for preserving constant tab width*/}
                <span className={styles.hidden}>{renderTitle()}</span>
              </div>
            );
          })}
        </div>
        <div className={styles.tab}>
          {children.filter(({props}, i) => {
            const key = props.id || String(i);
            return key === selected;
          })[0]}
        </div>
      </div>
    );
  }
}

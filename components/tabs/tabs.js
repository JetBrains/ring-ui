import React, {PropTypes} from 'react';
import classNames from 'classnames';

import RingComponent from '../ring-component/ring-component';

import styles from './tabs.css';

/**
 * @name Tabs
 * @category Components
 * @framework React
 * @constructor
 * @description Displays a tab set
 * @example-file ./tabs.examples.html
 */

export class Tabs extends RingComponent {
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
            const titleClasses = classNames(styles.title, {
              [styles.selected]: key === selected
            });
            return (
              <div
                key={key}
                className={titleClasses}
                disabled={disabled}
                onClick={() => onSelect(key)}
              >
                <span className={styles.visible}>{title}</span>
                {/* hack for preserving constant tab width*/}
                <span className={styles.hidden}>{title}</span>
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

export class Tab extends RingComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.string,
    className: PropTypes.string
  }

  render() {
    const {className, children} = this.props;
    const classes = classNames(styles.tab, className);
    return (
      <div className={classes}>{children}</div>
    );
  }
}

export class SmartTabs extends RingComponent {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired
  }

  constructor(props) {
    super(props);
    const {children, initSelected} = props;
    this.state = {
      selected: initSelected || children[0].props.id || ['0']
    };
  }

  render() {
    const {children, initSelected, ...restProps} = this.props; // eslint-disable-line no-unused-vars
    return (
      <Tabs
        selected={this.state.selected}
        onSelect={selected => this.setState({selected})}
        {...restProps}
      >{children}</Tabs>
    );
  }
}

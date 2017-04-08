import React, {Component, cloneElement} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Sidebar from './sidebar';
import styles from './content-layout.css';

/**
 * @name Content Layout
 * @category Components
 * @framework React
 * @constructor
 * @description A component for simple content layout.
 * @example-file ./content-layout.examples.html
 */

export default class ContentLayout extends Component {
  state = {};

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    responsive: PropTypes.bool
  };

  static defaultProps = {
    responsive: true
  };

  saveContentNode = contentNode => {
    this.setState({contentNode});
  }

  render() {
    const {children, className, responsive, ...restProps} = this.props;
    const classes = classNames(styles.contentLayout, className, {
      [styles.contentLayoutResponsive]: responsive
    });

    const childrenArray = React.Children.toArray(children);
    const sidebarChild = childrenArray.filter(child => child && child.type === Sidebar)[0];

    const sidebar = sidebarChild && cloneElement(sidebarChild, {
      contentNode: this.state.contentNode
    });
    const contentChildren = childrenArray.filter(child => child !== sidebarChild);

    return (
      <div
        {...restProps}
        className={classes}
      >
        {sidebar}
        <div
          className={styles.contentLayoutContent}
          ref={this.saveContentNode}
        >
          {contentChildren}
        </div>
      </div>
    );
  }
}

export {default as Sidebar} from './sidebar';

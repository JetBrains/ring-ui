import React, {PropTypes} from 'react';
import classNames from 'classnames';
import styles from './content-layout.css';
import Waypoint from 'react-waypoint';

import RingComponent from '../ring-component/ring-component';

const ABOVE = 'above';
const INSIDE = 'inside';

export default class ContentLayoutSidebar extends RingComponent {
  static propTypes = {
    right: PropTypes.bool,
    className: PropTypes.string
  };

  state = {
    topIsOutside: true,
    bottomIsOutside: true,
    sidebarHeight: null
  };

  handleTopWaypoint({currentPosition}) {
    this.setState({topIsOutside: currentPosition === ABOVE});
  }

  handleBottomWaypoint({currentPosition, waypointTop}) {
    this.setState({
      sidebarHeight: waypointTop,
      bottomIsOutside: currentPosition !== INSIDE
    });
  }

  render() {
    const {right, children, className, ...restProps} = this.props;

    const shouldFixateBottom = !this.state.bottomIsOutside && this.state.topIsOutside;

    const containerClasses = classNames(styles.sidebarContainer, {
      [styles.sidebarContainerRight]: right
    });

    const classes = classNames(styles.sidebar, className, {
      [styles.sidebarRight]: right,
      [styles.sidebarFixedTop]: this.state.bottomIsOutside && this.state.topIsOutside,
      [styles.sidebarFixedBottom]: shouldFixateBottom
    });

    const style = {
      maxHeight: shouldFixateBottom && this.state.sidebarHeight ? `${this.state.sidebarHeight}px` : null
    };

    return (
      <div className={containerClasses}>
        <Waypoint
          onEnter={data => this.handleTopWaypoint(data)}
          onLeave={data => this.handleTopWaypoint(data)}
        />

        <div
          {...restProps}
          style={style}
          className={classes}
        >
          {children}
        </div>

        <div className={styles.bottomMarker}>
          <Waypoint
            onEnter={data => this.handleBottomWaypoint(data)}
            onLeave={data => this.handleBottomWaypoint(data)}
          />
        </div>
      </div>
    );
  }
}

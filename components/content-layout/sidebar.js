import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Waypoint from 'react-waypoint';

import styles from './content-layout.css';

const ABOVE = 'above';
const INSIDE = 'inside';

export default class Sidebar extends Component {
  static propTypes = {
    right: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    contentNode: PropTypes.object
  };

  state = {
    topIsOutside: true,
    bottomIsOutside: true
  };

  handleTopWaypoint({currentPosition}) {
    this.setState({topIsOutside: currentPosition === ABOVE});
  }

  handleBottomWaypoint({currentPosition, waypointTop}) {
    this.setState({
      sidebarVisibleHeight: waypointTop,
      bottomIsOutside: currentPosition !== INSIDE
    });
  }

  shouldUseFixation() {
    const {contentNode} = this.props;
    const {sidebarNode} = this;
    if (!contentNode || !sidebarNode) {
      return false;
    }
    return contentNode.offsetHeight >= sidebarNode.offsetHeight;
  }

  shouldFixateBottom() {
    const {topIsOutside, bottomIsOutside} = this.state;
    return !bottomIsOutside && topIsOutside && this.shouldUseFixation();
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const {right, children, className, contentNode, ...restProps} = this.props;
    const {topIsOutside, bottomIsOutside, sidebarVisibleHeight} = this.state;

    const shouldFixateTop = bottomIsOutside && topIsOutside && this.shouldUseFixation();
    const shouldFixateBottom = this.shouldFixateBottom();

    const containerClasses = classNames(styles.sidebarContainer, {
      [styles.sidebarContainerRight]: right
    });

    const classes = classNames(styles.sidebar, className, {
      [styles.sidebarRight]: right,
      [styles.sidebarFixedTop]: shouldFixateTop,
      [styles.sidebarFixedBottom]: shouldFixateBottom
    });

    const style = {
      maxHeight: shouldFixateBottom && sidebarVisibleHeight ? `${sidebarVisibleHeight}px` : null
    };

    return (
      <div
        className={containerClasses}
        ref={node => {
          this.sidebarNode = node;
        }}
      >
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

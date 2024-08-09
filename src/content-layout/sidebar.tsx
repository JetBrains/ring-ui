import {Component, HTMLAttributes} from 'react';
import classNames from 'classnames';
import {Waypoint} from 'react-waypoint';

import styles from './content-layout.css';

const ABOVE = 'above';
const INSIDE = 'inside';

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  right?: boolean | null | undefined
  containerClassName?: string | null | undefined
  fixedClassName?: string | null | undefined
  contentNode?: HTMLElement | null | undefined
}

export default class Sidebar extends Component<SidebarProps> {
  state = {
    topIsOutside: true,
    bottomIsOutside: true,
    sidebarVisibleHeight: undefined
  };

  sidebarNode?: HTMLElement | null;

  handleTopWaypoint = ({currentPosition}: Waypoint.CallbackArgs) => {
    this.setState({topIsOutside: currentPosition === ABOVE});
  };

  handleBottomWaypoint = ({currentPosition, waypointTop}: Waypoint.CallbackArgs) => {
    this.setState({
      sidebarVisibleHeight: waypointTop,
      bottomIsOutside: currentPosition !== INSIDE
    });
  };

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

  sidebarRef = (node: HTMLElement | null) => {
    this.sidebarNode = node;
  };

  render() {
    const {right, children, className, containerClassName,
      fixedClassName, contentNode, ...restProps} = this.props;
    const {topIsOutside, bottomIsOutside, sidebarVisibleHeight} = this.state;

    const shouldFixateTop = bottomIsOutside && topIsOutside && this.shouldUseFixation();
    const shouldFixateBottom = this.shouldFixateBottom();

    const containerClasses = classNames(styles.sidebarContainer, containerClassName, {
      [styles.sidebarContainerRight]: right
    });

    const classes = classNames(styles.sidebar, className, {
      [styles.sidebarRight]: right,
      [styles.sidebarFixedTop]: shouldFixateTop,
      [styles.sidebarFixedBottom]: shouldFixateBottom,
      [fixedClassName ?? '']: shouldFixateTop || shouldFixateBottom
    });

    const style = {
      maxHeight: shouldFixateBottom && sidebarVisibleHeight ? `${sidebarVisibleHeight}px` : undefined
    };

    return (
      <aside
        className={containerClasses}
        ref={this.sidebarRef}
      >
        <Waypoint
          onEnter={this.handleTopWaypoint}
          onLeave={this.handleTopWaypoint}
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
            onEnter={this.handleBottomWaypoint}
            onLeave={this.handleBottomWaypoint}
          />
        </div>
      </aside>
    );
  }
}

import {Children, cloneElement, Component, HTMLAttributes, ReactElement} from 'react';
import classNames from 'classnames';

import Sidebar, {SidebarProps} from './sidebar';
import styles from './content-layout.css';

export interface ContentLayoutProps extends HTMLAttributes<HTMLElement> {
  responsive: boolean;
  contentClassName?: string | null | undefined;
}

/**
 * @name Content Layout
 */

export default class ContentLayout extends Component<ContentLayoutProps> {
  static defaultProps = {
    responsive: true,
  };

  state = {
    contentNode: null,
  };

  saveContentNode = (contentNode: HTMLElement | null) => {
    this.setState({contentNode});
  };

  render() {
    const {children, className, contentClassName, responsive, ...restProps} = this.props;

    const classes = classNames(styles.contentLayout, className, {
      [styles.contentLayoutResponsive]: responsive,
    });

    const contentClasses = classNames(styles.contentLayoutContent, contentClassName);

    const childrenArray = Children.toArray(children);
    const sidebarChild = childrenArray.filter(
      (child): child is ReactElement<SidebarProps, typeof Sidebar> =>
        child != null && typeof child === 'object' && 'type' in child && child.type === Sidebar,
    )[0];

    const sidebar =
      sidebarChild &&
      cloneElement(sidebarChild, {
        contentNode: this.state.contentNode,
      });
    const contentChildren = childrenArray.filter(child => child !== sidebarChild);

    return (
      <div data-test="content-layout" {...restProps} className={classes}>
        {sidebar}
        <main className={contentClasses} ref={this.saveContentNode}>
          {contentChildren}
        </main>
      </div>
    );
  }
}

export {default as Sidebar} from './sidebar';

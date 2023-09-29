import React, {
  PureComponent,
  ReactNode,
  ComponentType,
  HTMLAttributes,
  MouseEventHandler
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import ClickableLink, {ClickableLinkProps} from './clickableLink';
import styles from './link.css';

/**
 * @name Link
 */

export interface LinkBaseProps {
  active?: boolean | null | undefined
  inherit?: boolean | null | undefined
  pseudo?: boolean | null | undefined
  hover?: boolean | null | undefined
  'data-test'?: string | null | undefined
  children: ReactNode
}

export type LinkProps<P extends ClickableLinkProps = ClickableLinkProps> =
  Omit<P, keyof LinkBaseProps> & LinkBaseProps

export function linkHOC<P extends ClickableLinkProps>(
  ComposedComponent: ComponentType<P> | string
) {
  const isCustom = typeof ComposedComponent !== 'string' && ComposedComponent !== ClickableLink;

  return class Link extends PureComponent<LinkProps<P>> {
    static propTypes = {
      className: PropTypes.string,
      active: PropTypes.bool,
      inherit: PropTypes.bool,
      pseudo: PropTypes.bool,
      hover: PropTypes.bool,
      children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
      'data-test': PropTypes.string,
      href: PropTypes.string,
      onPlainLeftClick: PropTypes.func,
      onClick: PropTypes.func
    };

    render() {
      const {
        active,
        inherit,
        pseudo,
        hover,
        className,
        'data-test': dataTest,
        href,
        children, onPlainLeftClick, onClick,
        ...restProps
      } = this.props;
      const useButton = pseudo || !isCustom && href == null;

      const classes = classNames(styles.link, className, {
        [styles.active]: active,
        [styles.inherit]: inherit,
        [styles.hover]: hover,
        [styles.pseudo]: useButton
      });

      let props = restProps;
      if (isCustom && !props.activeClassName) {
        props = {...props, activeClassName: styles.active};
      }

      if (useButton) {
        return (
          <button
            type="button"
            {...props as HTMLAttributes<HTMLElement>}
            className={classes}
            onClick={(onClick || onPlainLeftClick) as MouseEventHandler}
            data-test={dataTests('ring-link', dataTest)}
          >{children}</button>
        );
      }

      return (
        <ComposedComponent
          {...props as P}
          href={href}
          className={classes}
          onClick={onClick}
          onPlainLeftClick={onPlainLeftClick}
          data-test={dataTests('ring-link', dataTest)}
        >
          {children}
        </ComposedComponent>
      );
    }
  };
}

export default linkHOC(ClickableLink);

import {
  PureComponent,
  type ReactNode,
  type ComponentType,
  type HTMLAttributes,
  type MouseEventHandler,
  type ComponentClass,
} from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';
import ClickableLink, {type ClickableLinkProps} from './clickable-link';
import styles from './link.css';

/**
 * @name Link
 */

export interface LinkBaseProps {
  active?: boolean | null | undefined;
  inherit?: boolean | null | undefined;
  pseudo?: boolean | null | undefined;
  hover?: boolean | null | undefined;
  'data-test'?: string | null | undefined;
  children: ReactNode;
}

export type LinkProps<P extends ClickableLinkProps = ClickableLinkProps> = Omit<P, keyof LinkBaseProps> & LinkBaseProps;

export function linkHOC<P extends ClickableLinkProps>(
  ComposedComponent: ComponentType<P> | string,
): ComponentClass<LinkProps<P>> {
  const isCustom = typeof ComposedComponent !== 'string' && ComposedComponent !== ClickableLink;

  return class Link extends PureComponent<LinkProps<P>> {
    render() {
      const {
        active,
        inherit,
        pseudo,
        hover,
        className,
        'data-test': dataTest,
        href,
        children,
        onPlainLeftClick,
        onClick,
        ...restProps
      } = this.props;
      const useButton = pseudo || (!isCustom && (href === null || href === undefined));

      const classes = classNames(styles.link, className, {
        [styles.active]: active,
        [styles.inherit]: inherit,
        [styles.hover]: hover,
        [styles.pseudo]: useButton,
      });

      let props = restProps;
      if (isCustom && !props.activeClassName) {
        props = {...props, activeClassName: styles.active};
      }

      if (useButton) {
        return (
          <button
            type='button'
            {...(props as HTMLAttributes<HTMLElement>)}
            className={classes}
            onClick={(onClick || onPlainLeftClick) as MouseEventHandler}
            data-test={dataTests('ring-link', dataTest)}
          >
            {children}
          </button>
        );
      }

      return (
        <ComposedComponent
          {...(props as P)}
          href={href}
          className={classes}
          onClick={onClick}
          {...(typeof ComposedComponent !== 'string' ? {onPlainLeftClick} : {})}
          data-test={dataTests('ring-link', dataTest)}
        >
          {children}
        </ComposedComponent>
      );
    }
  };
}

export default linkHOC(ClickableLink);

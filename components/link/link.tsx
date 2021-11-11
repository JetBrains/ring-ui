import 'focus-visible';
import React, {
  Component,
  memo,
  ReactNode,
  ComponentType,
  HTMLAttributes,
  MouseEventHandler
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import memoize from '../global/memoize';
import dataTests from '../global/data-tests';

import ClickableLink, {ClickableLinkProps} from './clickableLink';
import styles from './link.css';

/**
 * @name Link
 */

let isCompatibilityMode = false;

export function setCompatibilityMode(isEnabled: boolean) {
  isCompatibilityMode = isEnabled;
}

export interface WrapTextProps {
  children: ReactNode
  className?: string | null | undefined
}

const makeWrapText = memoize((innerClassName: string | null | undefined) => {
  function WrapText({className, children}: WrapTextProps) {
    const classes = classNames(styles.inner, className, innerClassName);
    return <span className={classes}>{children}</span>;
  }

  WrapText.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  return memo(WrapText);
});

type ChildrenFunction = (WrapText: ComponentType<WrapTextProps>) => ReactNode

export interface LinkBaseProps {
  active?: boolean | null | undefined
  inherit?: boolean | null | undefined
  pseudo?: boolean | null | undefined
  hover?: boolean | null | undefined
  innerClassName?: string | null | undefined
  'data-test'?: string | null | undefined
  children: ReactNode | ChildrenFunction,
}

export type LinkProps<P extends ClickableLinkProps = ClickableLinkProps> =
  Omit<P, keyof LinkBaseProps> & LinkBaseProps

export function linkHOC<P extends ClickableLinkProps>(
  ComposedComponent: ComponentType<P> | string
) {
  const isCustom = typeof ComposedComponent !== 'string' && ComposedComponent !== ClickableLink;

  return class Link extends Component<LinkProps<P>> {
    static propTypes = {
      className: PropTypes.string,
      innerClassName: PropTypes.string,
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

    getChildren() {
      const {children, innerClassName} = this.props;

      const WrapText = makeWrapText(innerClassName);

      return typeof children === 'function'
        ? (children as ChildrenFunction)(WrapText)
        : <WrapText>{children}</WrapText>;
    }

    render() {
      const {
        active,
        inherit,
        pseudo,
        hover,
        className,
        'data-test': dataTest,
        href,
        innerClassName, children, onPlainLeftClick, onClick,
        ...restProps
      } = this.props;
      const useButton = pseudo || !isCustom && href == null;

      const classes = classNames(styles.link, className, {
        [styles.active]: active,
        [styles.inherit]: inherit,
        [styles.hover]: hover,
        [styles.compatibilityUnderlineMode]: isCompatibilityMode,
        [styles.pseudo]: useButton,
        [styles.text]: typeof children !== 'function'
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
          >{this.getChildren()}</button>
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
          {this.getChildren()}
        </ComposedComponent>
      );
    }
  };
}

export default linkHOC(ClickableLink);

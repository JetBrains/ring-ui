import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './link.css';

/**
 * @name Link
 * @category Components
 * @tags 3.0
 * @constructor
 * @description Displays a link.
 * @extends {ReactComponent}
 * @example-file ./link.examples.html
 */

function makeWrapText(innerClassName) {
  const WrapText = ({className, children}) => {
    const classes = classNames(styles.inner, className, innerClassName);
    return <span className={classes}>{children}</span>;
  };

  WrapText.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  return WrapText;
}

export function linkHOC(ComposedComponent) {
  const isTag = typeof ComposedComponent === 'string';

  return class Link extends Component {
    static propTypes = {
      className: PropTypes.string,
      innerClassName: PropTypes.string,
      active: PropTypes.bool,
      inherit: PropTypes.bool,
      pseudo: PropTypes.bool,
      hover: PropTypes.bool,
      children: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
    }

    render() {
      const {
        active,
        inherit,
        pseudo,
        hover,
        className,
        innerClassName,
        children,
        ...props
      } = this.props;
      const classes = classNames(styles.link, className, {
        [styles.active]: active,
        [styles.inherit]: inherit,
        [styles.hover]: hover
      });

      if (!isTag && !props.activeClassName) {
        props.activeClassName = styles.active;
      }

      if (pseudo) {
        return (
          <span
            {...props}
            className={classes}
            data-test="ring-link"
          >{children}</span>
        );
      }

      const WrapText = makeWrapText(innerClassName);

      return (
        <ComposedComponent
          {...props}
          className={classes}
          data-test="ring-link"
        >
          {typeof children === 'function'
            ? children(WrapText)
            : <WrapText>{children}</WrapText>
          }
        </ComposedComponent>
      );
    }
  };
}

export default linkHOC('a');

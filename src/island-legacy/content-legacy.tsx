import {HTMLAttributes, PureComponent} from 'react';
import classNames from 'classnames';

import './island-legacy.css';

export default class Content extends PureComponent<HTMLAttributes<HTMLElement>> {
  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames('ring-island__content', className);

    return (
      <div
        {...restProps}
        className={classes}
      >
        {children}
      </div>
    );
  }
}

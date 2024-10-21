import {HTMLAttributes, PureComponent} from 'react';
import classNames from 'classnames';

import './island-legacy.css';

export default class Header extends PureComponent<HTMLAttributes<HTMLElement>> {
  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames('ring-island__header', className);

    return (
      <div {...restProps} className={classes}>
        <div className="ring-island__title">{children}</div>
      </div>
    );
  }
}

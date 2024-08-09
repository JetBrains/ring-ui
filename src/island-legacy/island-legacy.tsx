import {HTMLAttributes, PureComponent} from 'react';
import classNames from 'classnames';

import './island-legacy.css';

export default class Island extends PureComponent<HTMLAttributes<HTMLElement>> {
  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames('ring-island', className);

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

export {default as Header} from './header-legacy';
export {default as Content} from './content-legacy';

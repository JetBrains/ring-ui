import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';
import './island-legacy.scss';

export default class Content extends RingComponent {
  static propTypes = {
    className: PropTypes.string
  };

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

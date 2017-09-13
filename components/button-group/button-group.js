import React, {PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './button-group.scss';

/**
 * @name Button Group
 * @category Components
 * @constructor
 * @description Allows to group several buttons.
 * @extends {ReactComponent}
 * @example-file ./button-group.examples.html
 */
export default class ButtonGroup extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const classes = classNames('ring-button-group', this.props.className);
    return (
      <div
        {...this.props}
        className={classes}
      >
        {this.props.children}
      </div>
    );
  }
}

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dataTests from '../global/data-tests';
import getEventKey from '../global/get-event-key';

import styles from './list.css';

export default class ListCustom extends PureComponent {
  static propTypes = {
    scrolling: PropTypes.bool,
    hover: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    rgItemType: PropTypes.number,
    tabIndex: PropTypes.number,
    template: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element,
      PropTypes.string
    ]),
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseUp: PropTypes.func,
    onCheckboxChange: PropTypes.func,
    'data-test': PropTypes.string
  };

  static defaultProps = {
    hover: false
  };

  handleKeyPress = event => {
    const key = getEventKey(event);
    if (key === 'Enter' || key === ' ') {
      this.props.onClick(event);
    }
  };

  render() {
    const {scrolling, hover, className, disabled, template, rgItemType, tabIndex, onClick, onCheckboxChange, onMouseOver, onMouseUp, ...restProps} = this.props; // eslint-disable-line no-unused-vars, max-len
    const classes = classNames(styles.item, className, {
      [styles.action]: !disabled,
      [styles.hover]: hover && !disabled,
      [styles.scrolling]: scrolling
    });


    const dataTest = dataTests('ring-list-item-custom', {
      'ring-list-item-action': !disabled
    }, restProps['data-test']);

    const content = (typeof template === 'function') ? template(this.props) : template;
    return (
      <span
        role="button"
        tabIndex={tabIndex}
        onClick={onClick}
        onKeyPress={this.handleKeyPress}
        onMouseOver={onMouseOver}
        onFocus={onMouseOver}
        onMouseUp={onMouseUp}
        className={classes}
        data-test={dataTest}
      >
        {content}
      </span>
    );
  }
}

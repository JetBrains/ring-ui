import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
    onMouseUp: PropTypes.func
  };

  static defaultProps = {
    hover: false
  };

  render() {
    const {scrolling, hover, className, disabled, template, rgItemType, tabIndex, onClick, onMouseOver, onMouseUp, ...restProps} = this.props; // eslint-disable-line no-unused-vars, max-len
    const classes = classNames({
      'ring-list__item': true,
      'ring-list__item_action': !disabled,
      'ring-list__item_hover': hover && !disabled,
      'ring-list__item_scrolling': scrolling
    }, className);

    const content = (typeof template === 'function') ? template(this.props) : template;
    return (
      <span
        tabIndex={tabIndex}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseUp={onMouseUp}
        className={classes}
      >
        {content}
      </span>
    );
  }
}

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Tag from '../tag/tag';

function noop() {}

/**
 * @name Tags List
 */

export default class TagsList extends Component {
  static propTypes = {
    children: PropTypes.node,
    tags: PropTypes.array,
    customTagComponent: (props, propName, componentName) => {
      if (props[propName] && !props[propName].prototype instanceof Component) {
        return new Error(`Invalid prop ${propName} supplied to ${componentName}. Validation failed.`);
      }
      return null;
    },
    activeIndex: PropTypes.number,
    canNotBeEmpty: PropTypes.bool,
    disabled: PropTypes.bool,
    handleClick: PropTypes.func,
    handleRemove: PropTypes.func,
    className: PropTypes.string,
    tagClassName: PropTypes.string
  };

  static defaultProps = {
    customTagComponent: null,
    canNotBeEmpty: false,
    disabled: false,
    handleClick: noop,
    handleRemove: noop
  };

  renderTag(tag, focusTag) {
    const TagComponent = this.props.customTagComponent || Tag;
    const readOnly = this.props.disabled || tag.readOnly ||
      (this.props.canNotBeEmpty && this.props.tags.length === 1);

    const {tagClassName} = this.props;

    return (
      <TagComponent
        {...tag}
        readOnly={readOnly}
        disabled={this.props.disabled || tag.disabled}
        focused={focusTag}
        onClick={this.props.handleClick(tag)}
        onRemove={this.props.handleRemove(tag)}
        className={tagClassName}
      >{tag.label}</TagComponent>);
  }

  render() {
    const {
      children, className, customTagComponent, canNotBeEmpty, handleClick, tagClassName, handleRemove, tags, activeIndex, // eslint-disable-line no-unused-vars, max-len
      ...props
    } = this.props;
    const classes = classNames(
      'ring-js-shortcuts',
      className
    );

    const tagsList = (this.props.tags || []).map(
      (tag, index) => this.renderTag(tag, this.props.activeIndex === index)
    );

    return (
      <div
        data-test="ring-tags-list"
        className={classes}
        {...props}
      >
        {tagsList}
        {children}
      </div>);
  }
}

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Tag from '../tag/tag';

import './tags-list.scss';

function noop() {}

/**
 * @name Tags List
 * @category Forms
 * @constructor
 * @description Displays a list of tags.
 * @extends {ReactComponent}
 * @example-file ./tags-list.examples.html
 */

export default class TagsList extends Component {
  static propTypes = {
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
    className: PropTypes.string
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
    const readOnly = this.props.disabled ||
      tag.readOnly ||
      (this.props.canNotBeEmpty && this.props.tags.length === 1);

    return (
      <TagComponent
        {...tag}
        readOnly={readOnly}
        focused={focusTag}
        onClick={this.props.handleClick(tag)}
        onRemove={this.props.handleRemove(tag)}
      >{tag.label}</TagComponent>);
  }

  render() {
    const {
      className, customTagComponent, canNotBeEmpty, handleClick, handleRemove, tags, activeIndex, // eslint-disable-line no-unused-vars
      ...props
    } = this.props;
    const classes = classNames(
      'ring-js-shortcuts',
      'ring-tags-list',
      {
        'ring-tags-list_disabled': this.props.disabled
      },
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
      </div>);
  }
}

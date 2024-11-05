import {Component, ComponentType, HTMLAttributes, ReactNode} from 'react';
import * as React from 'react';
import classNames from 'classnames';

import Tag, {TagAttrs} from '../tag/tag';

function noop() {}

export interface TagType extends Omit<TagAttrs, 'onClick' | 'children'> {
  label?: ReactNode;
  key?: string | number | null | undefined;
}

export interface TagsListProps<T extends TagType> extends HTMLAttributes<HTMLElement> {
  tags: readonly T[];
  customTagComponent: ComponentType<TagAttrs>;
  canNotBeEmpty: boolean;
  disabled: boolean;
  handleClick: (tag: T) => (e: React.MouseEvent<HTMLElement>) => void;
  handleRemove: (tag: T) => (e: React.MouseEvent<HTMLElement>) => void;
  activeIndex?: number | null | undefined;
  tagClassName?: string | null | undefined;
}

/**
 * @name Tags List
 */

export default class TagsList<T extends TagType> extends Component<TagsListProps<T>> {
  static defaultProps = {
    customTagComponent: null,
    canNotBeEmpty: false,
    disabled: false,
    handleClick: () => noop,
    handleRemove: () => noop,
  };

  renderTag(tag: T, focusTag: boolean) {
    const TagComponent = this.props.customTagComponent || Tag;
    const readOnly = this.props.disabled || tag.readOnly || (this.props.canNotBeEmpty && this.props.tags.length === 1);

    const {tagClassName} = this.props;

    return (
      <TagComponent
        {...tag}
        key={tag.key}
        readOnly={readOnly}
        disabled={this.props.disabled || tag.disabled}
        focused={focusTag}
        onClick={this.props.handleClick(tag)}
        onRemove={this.props.handleRemove(tag)}
        className={tagClassName}
      >
        {tag.label}
      </TagComponent>
    );
  }

  render() {
    const {
      children,
      className,
      customTagComponent,
      canNotBeEmpty,
      handleClick,
      tagClassName,
      handleRemove,
      tags,
      activeIndex,
      ...props
    } = this.props;
    const classes = classNames('ring-js-shortcuts', className);

    const tagsList = (this.props.tags || []).map((tag, index) => this.renderTag(tag, this.props.activeIndex === index));

    return (
      <div data-test="ring-tags-list" className={classes} {...props}>
        {tagsList}
        {children}
      </div>
    );
  }
}

export type TagsListAttrs<T extends TagType = TagType> = JSX.LibraryManagedAttributes<
  typeof TagsList,
  TagsListProps<T>
>;

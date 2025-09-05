import {HTMLAttributes, PureComponent, ReactNode, RefCallback} from 'react';
import * as React from 'react';
import classNames from 'classnames';
import closeIcon from '@jetbrains/icons/close-12px';

import Icon, {IconType} from '../icon/icon';
import Button from '../button/button';
import {ControlsHeight} from '../global/controls-height';

import styles from './tag.css';

export interface TagRenderProps extends HTMLAttributes<HTMLElement> {
  disabled: boolean;
  ref: RefCallback<HTMLElement>;
  'data-test': string;
}

export enum TagType {
  DEFAULT = 'default',
  MAIN = 'main',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  PURPLE = 'purple',
}

export interface TagProps {
  onRemove?: ((event: React.MouseEvent<HTMLElement>) => void) | null;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  readOnly: boolean;
  disabled: boolean;
  focused: boolean;
  render: (props: TagRenderProps) => ReactNode;
  children?: ReactNode;
  className?: string | null | undefined;
  containerClassName?: string | null | undefined;
  rgTagIcon?: string | IconType | null | undefined;
  icon?: string | undefined;
  avatar?: string | null | undefined;
  rgTagTitle?: string | undefined;
  textColor?: string | undefined;
  backgroundColor?: string | undefined;
  outline?: boolean;
  tagType?: TagType;
}

/**
 * @name Tag
 */

export default class Tag extends PureComponent<TagProps> {
  static defaultProps: TagProps = {
    onClick: () => {},
    readOnly: false,
    disabled: false,
    focused: false,
    render: props => <button type="button" {...props} />,
    tagType: TagType.DEFAULT,
  };

  state = {
    focused: false,
  };

  componentDidUpdate(prevProps: TagProps) {
    if (this.props.focused !== prevProps.focused) {
      this.setState({focused: this.props.focused});
    }
    if (this.state.focused) {
      this.tagNode?.focus();
    }
    this.setDocumentClickListener(this.state.focused);
  }

  componentWillUnmount() {
    this.setDocumentClickListener(false);
    this.setState({focused: false});
  }

  static Type = TagType;

  onDocumentClick = (event: MouseEvent) => {
    if (this.tagNode) {
      this.setState({focused: this.tagNode === event.target});
    }
  };

  tagNode?: HTMLElement | null;
  tagRef = (el: HTMLElement | null) => {
    this.tagNode = el;
  };

  setDocumentClickListener(setListener: boolean) {
    if (setListener) {
      document.addEventListener('click', this.onDocumentClick);
    } else {
      document.removeEventListener('click', this.onDocumentClick);
    }
  }

  renderCustomIcon() {
    if (this.props.rgTagIcon) {
      return <Icon className={styles.icon} title={this.props.rgTagTitle} glyph={this.props.rgTagIcon} />;
    }
    return null;
  }

  private _renderImageElement(avatarSrc?: string) {
    const classes = classNames({
      [styles.customIcon]: this.props.icon,
      [styles.avatarIcon]: avatarSrc,
    });
    return <img alt={avatarSrc ? 'Avatar' : 'Icon'} className={classes} src={avatarSrc || this.props.icon} />;
  }

  renderImage() {
    if (this.props.icon && !this.props.avatar) {
      return this._renderImageElement();
    }
    return null;
  }

  renderAvatar() {
    if (this.props.avatar) {
      return <span className={styles.avatarContainer}>{this._renderImageElement(this.props.avatar)}</span>;
    }
    return null;
  }

  renderRemoveIcon() {
    if (!this.props.readOnly && this.props.onRemove) {
      return (
        <Button
          title="Remove"
          icon={closeIcon}
          data-test="ring-tag-remove"
          className={styles.remove}
          onClick={this.props.onRemove}
          style={{'--ring-secondary-color': this.props.textColor}}
          height={ControlsHeight.M}
        />
      );
    }
    return null;
  }

  render() {
    const classes = classNames(
      'ring-js-shortcuts',
      styles.tag,
      {
        [styles.focused]: this.state.focused,
        [styles.disabled]: this.props.disabled,
        [styles.withRemove]: !this.props.readOnly && this.props.onRemove,
      },
      this.props.className,
    );

    const {backgroundColor, textColor, render} = this.props;

    return (
      <span
        className={classNames(styles.container, this.props.containerClassName, styles[this.props.tagType!], {
          [styles.outline]: this.props.outline,
        })}
      >
        {render({
          'data-test': 'ring-tag',
          className: classes,
          ref: this.tagRef,
          onClick: this.props.onClick,
          style: {backgroundColor, color: textColor},
          disabled: this.props.disabled,
          children: (
            <>
              {this.renderAvatar()}
              {this.renderCustomIcon()}
              {this.renderImage()}
              <span className={styles.content}>{this.props.children}</span>
            </>
          ),
        })}
        {this.renderRemoveIcon()}
      </span>
    );
  }
}

export type TagAttrs = React.JSX.LibraryManagedAttributes<typeof Tag, TagProps>;

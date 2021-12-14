import React, {Component, ComponentType, ReactNode} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import gift from '@jetbrains/icons/gift';

import Popup, {PopupAttrs} from '../popup/popup';
import {Directions} from '../popup/popup.consts';
import Icon, {IconType} from '../icon/icon';
import Button, {ButtonAttrs} from '../button/button';

import styles from './message.css';


/**
  * @name Message
  */

const UNIT = 8;

const getTailOffsets = (offset: number) => ({
  [Directions.BOTTOM_RIGHT]: {top: 0, left: offset - UNIT, transform: 'rotate(180deg)'},
  [Directions.BOTTOM_LEFT]: {top: 0, right: offset - UNIT, transform: 'rotate(180deg)'},
  [Directions.BOTTOM_CENTER]: {top: 0, left: offset - UNIT, transform: 'rotate(180deg)'},
  [Directions.TOP_RIGHT]: {bottom: -UNIT + 1, left: offset - UNIT},
  [Directions.TOP_LEFT]: {bottom: -UNIT + 1, right: offset - UNIT},
  [Directions.TOP_CENTER]: {bottom: -UNIT + 1, left: offset - UNIT},
  [Directions.RIGHT_TOP]: {bottom: offset - UNIT, left: -UNIT, transform: 'rotate(90deg)'},
  [Directions.RIGHT_BOTTOM]: {top: offset, left: -UNIT, transform: 'rotate(90deg)'},
  [Directions.RIGHT_CENTER]: {top: offset, left: -UNIT, transform: 'rotate(90deg)'},
  [Directions.LEFT_TOP]: {bottom: offset - UNIT, right: -UNIT, transform: 'rotate(-90deg)'},
  [Directions.LEFT_BOTTOM]: {top: offset, right: -UNIT, transform: 'rotate(-90deg)'},
  [Directions.LEFT_CENTER]: {top: offset, right: -UNIT, transform: 'rotate(-90deg)'}
});

export interface MessageTranslations {
  gotIt: string
  dismiss: string
}

export interface MessageProps {
  icon: string | IconType | null
  directions: readonly Directions[]
  translations: MessageTranslations
  title?: string | null | undefined
  children?: ReactNode
  className?: string | null | undefined
  tailClassName?: string | null | undefined
  direction?: Directions | null | undefined
  popupProps?: Partial<PopupAttrs> | null | undefined
  buttonProps?: ButtonAttrs | null | undefined
  tailOffset?: number | null | undefined
  onClose?: (() => void) | undefined
  onDismiss?: (() => void) | null | undefined
}

interface MessageState {
  direction?: Directions
}

/**
 * Displays a popup containing a message.
 */
export default class Message extends Component<MessageProps> {
  static defaultProps = {
    icon: gift,
    directions: [
      Directions.TOP_RIGHT, Directions.TOP_LEFT, Directions.TOP_CENTER,
      Directions.BOTTOM_RIGHT, Directions.BOTTOM_LEFT, Directions.BOTTOM_CENTER,
      Directions.RIGHT_TOP, Directions.RIGHT_BOTTOM, Directions.RIGHT_CENTER,
      Directions.LEFT_TOP, Directions.LEFT_BOTTOM, Directions.LEFT_CENTER
    ],
    translations: {
      gotIt: 'Got it',
      dismiss: 'Dismiss'
    }
  };

  state: MessageState = {};

  static Directions = Directions;
  static PopupProps = Popup.PopupProps;

  private _onDirectionChange = (direction: Directions) =>
    this.setState({direction});

  popup?: Popup | null;
  node?: HTMLElement | null;
  popupRef = (el: Popup | null) => {
    this.popup = el;
    this.node = this.popup?.node;
  };

  getTailOffset() {
    const DEFAULT_OFFSET = 32;
    const {popupProps} = this.props;
    if (this.props.tailOffset != null) {
      return this.props.tailOffset;
    }

    const anchor = popupProps?.anchorElement || this.popup?.parent;
    if (!anchor) {
      return DEFAULT_OFFSET;
    }

    const offset = Math.floor(anchor.offsetWidth / 2);

    const isOpenedToRight = this.state.direction != null &&
      [Directions.TOP_RIGHT, Directions.BOTTOM_RIGHT].includes(this.state.direction);
    if (popupProps?.left && isOpenedToRight) {
      return offset - popupProps?.left;
    }

    return offset;
  }

  render() {
    const {
      children,
      className,
      tailClassName,
      title,
      icon,
      popupProps,
      buttonProps,
      onClose,
      onDismiss,
      translations
    } = this.props;
    const classes = classNames(styles.message, className);
    const tailClasses = classNames(styles.tail, tailClassName);
    const popupDirections = this.props.direction
      ? [this.props.direction]
      : this.props.directions;

    const {direction} = this.state;

    return (
      <Popup
        ref={this.popupRef}
        hidden={false}
        directions={popupDirections}
        className={classes}
        offset={UNIT * 2}
        onDirectionChange={this._onDirectionChange}
        {...popupProps}
      >
        {direction && (
          <div className={tailClasses} style={getTailOffsets(this.getTailOffset())[direction]}/>
        )}

        {icon && <Icon className={styles.icon} glyph={icon}/>}
        <h1 data-test="rgMessageTitle" className={styles.title}>{title}</h1>
        {children && <div className={styles.description}>{children}</div>}
        {(onClose || buttonProps) && (
          <Button
            className={styles.button}
            onClick={onClose}
            primary
            {...buttonProps}
          >{translations.gotIt}</Button>
        )}
        {onDismiss && <Button onClick={onDismiss} text>{translations.dismiss}</Button>}
      </Popup>
    );
  }
}

(Message as ComponentType<unknown>).propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  tailClassName: PropTypes.string,
  title: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  directions: PropTypes.arrayOf(PropTypes.string),
  direction: PropTypes.string,
  popupProps: PropTypes.object,
  buttonProps: PropTypes.object,
  tailOffset: PropTypes.number,
  onClose: PropTypes.func,
  onDismiss: PropTypes.func,
  translations: PropTypes.object
};

export type MessageAttrs = JSX.LibraryManagedAttributes<typeof Message, MessageProps>

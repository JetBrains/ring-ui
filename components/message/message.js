import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import gift from '@jetbrains/icons/gift.svg';

import Popup from '../popup/popup';
import Icon from '../icon/icon';
import Button from '../button/button';

import styles from './message.css';

/**
  * @name Message
  * @category Components
  * @tags Ring UI Language
  * @framework React
  * @constructor
  * @description Displays a popup containing a message.
  * @example
    <example name="message">
      <file name="index.html">
        <div id="message"></div>
      </file>

      <file name="index.js">
        import React from 'react';
        import {render} from 'react-dom';
        import Message from '@jetbrains/ring-ui/components/message/message';

        const container = document.getElementById('message');

        render(
          <div style={{padding: 200}}>
            <span>
              Anchor
              <Message
                title="This is title"
                tailOffset={32}
              >
                This is long long long long long long long long long long long long long long long long long long description
              </Message>
            </span>
          </div>,
          container
        );
      </file>
    </example>
  */

const {Directions} = Popup.PopupProps;

const UNIT = 8;

const getTailOffsets = offset => ({
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

export default class Message extends PureComponent {
  static Directions = Directions;
  static PopupProps = Popup.PopupProps;

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    direction: PropTypes.string,
    popupProps: PropTypes.object,
    tailOffset: PropTypes.number,
    onClose: PropTypes.func
  };

  static defaultProps = {
    icon: gift,
    direction: Directions.TOP_RIGHT,
    tailOffset: 56
  };

  render() {
    const {
      children,
      className,
      title,
      icon,
      direction,
      tailOffset,
      popupProps,
      onClose
    } = this.props;
    const classes = classNames(styles.message, className);

    return (
      <Popup
        hidden={false}
        directions={[direction]}
        className={classes}
        offset={UNIT * 2}
        {...popupProps}
      >
        <div className={styles.tail} style={getTailOffsets(tailOffset)[direction]}/>
        {icon && <Icon className={styles.icon} glyph={icon} size={Icon.Size.Size16}/>}
        <h1 className={styles.title}>{title}</h1>
        {children && <p className={styles.description}>{children}</p>}
        <Button className={styles.button} onClick={onClose} primary>{'Got it'}</Button>
      </Popup>
    );
  }
}

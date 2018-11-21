import React, {Component} from 'react';
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
        const onGotIt = () => console.log('>>>>> got it');

        render(
          <div style={{padding: 200}}>
            <span>
              Anchor
              <Message
                title="This is title"
                onClose={onGotIt}
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

export default class Message extends Component {
  static Directions = Directions;
  static PopupProps = Popup.PopupProps;

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    title: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    directions: PropTypes.arrayOf(PropTypes.string),
    direction: PropTypes.string,
    popupProps: PropTypes.object,
    tailOffset: PropTypes.number,
    onClose: PropTypes.func,
    translations: PropTypes.object
  };

  static defaultProps = {
    icon: gift,
    directions: [
      Directions.TOP_RIGHT, Directions.TOP_LEFT, Directions.TOP_CENTER,
      Directions.BOTTOM_RIGHT, Directions.BOTTOM_LEFT, Directions.BOTTOM_CENTER,
      Directions.RIGHT_TOP, Directions.RIGHT_BOTTOM, Directions.RIGHT_CENTER,
      Directions.LEFT_TOP, Directions.LEFT_BOTTOM, Directions.LEFT_CENTER
    ],
    tailOffset: 56,
    translations: {
      gotIt: 'Got it!'
    }
  };

  state = {};

  _onDirectionChange = direction =>
    this.setState({direction});

  render() {
    const {
      children,
      className,
      title,
      icon,
      tailOffset,
      popupProps,
      onClose,
      translations
    } = this.props;
    const classes = classNames(styles.message, className);
    const popupDirections = this.props.direction
      ? [this.props.direction]
      : this.props.directions;

    const {direction} = this.state;

    return (
      <Popup
        hidden={false}
        directions={popupDirections}
        className={classes}
        offset={UNIT * 2}
        onDirectionChange={this._onDirectionChange}
        {...popupProps}
      >
        {direction && <div className={styles.tail} style={getTailOffsets(tailOffset)[direction]}/>}
        {icon && <Icon className={styles.icon} glyph={icon} size={Icon.Size.Size16}/>}
        <h1 className={styles.title}>{title}</h1>
        {children && <p className={styles.description}>{children}</p>}
        {
          onClose &&
          <Button className={styles.button} onClick={onClose} primary>{translations.gotIt}</Button>
        }
      </Popup>
    );
  }
}

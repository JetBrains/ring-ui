import React, {Component} from 'react';
import PropTypes from 'prop-types';

import getUID from '../global/get-uid';

import RadioItem, {RadioContext} from './radio__item';

/**
 * @name Radio
 * @category Components
 * @tags Ring UI Language
 * @constructor
 * @description Displays a radio button. Adopted from [react-radio-group](https://github.com/chenglou/react-radio-group).
 * @example-file ./radio.examples.html
 */

export default class Radio extends Component {
  static propTypes = {
    name: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool
    ]),
    onChange: PropTypes.func,
    children: PropTypes.node.isRequired
  };

  static Item = RadioItem;

  uid = getUID('ring-radio-');

  render() {
    return (
      <RadioContext.Provider value={{name: this.uid, ...this.props}}>
        {this.props.children}
      </RadioContext.Provider>
    );
  }
}


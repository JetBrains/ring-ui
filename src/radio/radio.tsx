import {Component} from 'react';
import PropTypes from 'prop-types';

import getUID from '../global/get-uid';

import RadioItem, {RadioContext, RadioProps} from './radio__item';

/**
 * @name Radio
 */

export default class Radio extends Component<RadioProps> {
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


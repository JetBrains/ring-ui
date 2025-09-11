import {Component} from 'react';

import getUID from '../global/get-uid';
import RadioItem, {RadioContext, type RadioProps} from './radio-item';

/**
 * @name Radio
 */

export default class Radio extends Component<RadioProps> {
  static Item = RadioItem;

  uid = getUID('ring-radio-');

  render() {
    return <RadioContext.Provider value={{name: this.uid, ...this.props}}>{this.props.children}</RadioContext.Provider>;
  }
}

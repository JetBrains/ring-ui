import React, {Children} from 'react';
import PropTypes from 'prop-types';

import RingComponent from '../ring-component/ring-component';
import RadioItem from './radio__item';

/**
 * @name Radio
 * @category Forms
 * @constructor
 * @description Displays a radio button. Adopted from [react-radio-group](https://github.com/chenglou/react-radio-group).
 * @example
   <example name="Radio button">
     <file name="index.html">
       <div id="container"></div>
     </file>

     <file name="index.js" webpack="true">
       import {render} from 'react-dom';
       import React from 'react';

       import Radio from 'ring-ui/components/radio/radio';
       import RadioItem from 'ring-ui/components/radio/radio__item';

       const container = document.getElementById('container');
       const radio = value => (
         <div>
           <span>Selected: {value}</span>
           <Radio onChange={newValue => render(radio(newValue), container)}>
             <RadioItem value="one">One</RadioItem>
             <RadioItem value="two">Two</RadioItem>
             <RadioItem value="three">Three</RadioItem>
           </Radio>
         </div>
       );

       render(radio('one'), container);
     </file>
   </example>
 */

export default class Radio extends RingComponent {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool
    ]),
    onChange: PropTypes.func,
    children: PropTypes.node.isRequired
  }

  static childContextTypes = {
    ringRadioGroup: PropTypes.object
  }

  static Item = RadioItem;

  constructor(...args) {
    super(...args);

    this.uid = this.constructor.getUID('ring-radio-');
  }

  getChildContext() {
    const name = this.uid;
    const {value, onChange} = this.props;

    return {
      ringRadioGroup: {name, value, onChange}
    };
  }

  render() {
    const {value, onChange, children, ...restProps} = this.props; // eslint-disable-line no-unused-vars
    if (Children.count(children) === 1 && typeof children === 'object') {
      return children;
      // Autowrapping of text and array children
    } else {
      return <div {...restProps}>{children}</div>;
    }
  }
}


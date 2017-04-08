import React, {Children, cloneElement} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import RingComponent from '../ring-component/ring-component';

import './error-bubble.scss';

/**
 * @name Error Bubble
 * @category Forms
 * @constructor
 * @description Displays an error bubble near the wrapped input component when a non-empty string is passed to the `error` prop.
 * Passes any prop except `className` down to input.
 * @example
   <example name="error-bubble">
     <file name="index.html">
       <div id="container"></div>
     </file>

     <file name="index.js" webpack="true">
       import {render} from 'react-dom';
       import React from 'react';

       import ErrorBubble from 'ring-ui/components/error-bubble/error-bubble';
       import Input from 'ring-ui/components/input/input';
       import 'ring-ui/components/input-size/input-size.scss';

       const container = document.getElementById('container');
       const renderBubbleDemo = value => (
         <ErrorBubble
           error={value ? null : 'Value is required'}
           valid={value}
           onInput={e => render(renderBubbleDemo(e.target.value), container)}
           placeholder="enter something"
         >
           <Input className="ring-input-size_md" />
         </ErrorBubble>
       );

       render(renderBubbleDemo(), container);
     </file>
   </example>
 */

export default class ErrorBubble extends RingComponent {
  static propTypes = {
    error: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node
  }

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames('ring-error-bubble active', className);

    return (
      <div className="ring-error-bubble-wrapper">
        {Children.map(children, child => cloneElement(child, restProps))}
        {restProps.error && (
          <div className={classes}>
            {restProps.error}
          </div>
        )}
      </div>
    );
  }
}


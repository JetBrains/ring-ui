import React, {Children, cloneElement, PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './error-bubble.scss';

/**
 * @name Error Bubble
 * @category Components
 * @constructor
 * @description Displays an error bubble near the wrapped input component when a non-empty string is passed to the `error` prop.
 * Passes any prop except `className` down to input.
 * @example
   <example name="Error Bubble">
     <file name="index.html">
       <div id="container"></div>
     </file>

     <file name="index.js" webpack="true">
       import {render} from 'react-dom';
       import React from 'react';

       import ErrorBubble from '@jetbrains/ring-ui/components/error-bubble/error-bubble';
       import Input from '@jetbrains/ring-ui/components/input/input';
       import '@jetbrains/ring-ui/components/input-size/input-size.scss';

       const container = document.getElementById('container');
       const renderBubbleDemo = value => (
         <ErrorBubble
           error={value ? null : 'Value is required'}
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

export default class ErrorBubble extends PureComponent {
  static propTypes = {
    error: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    // eslint-disable-next-line no-unused-vars
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


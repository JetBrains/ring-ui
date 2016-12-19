import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import styles from './<%= paramCaseName %>.css';

/**
 * @name <%= titleCaseName %>
 * @category Components
 * @framework React
 * @constructor
 * @description TODO add <%= titleCaseName %> description
 * @example
   <example name="<%= paramCaseName %>">
     <file name="index.html">
       <div id="<%= paramCaseName %>"></div>
     </file>

     <file name="index.js">
       import React, {Component} from 'react';
       import {render} from 'react-dom';

       import <%= pascalCaseName %> from 'ring-ui/components/<%= paramCaseName %>/<%= paramCaseName %>';

       const container = document.getElementById('<%= paramCaseName %>');
       class <%= pascalCaseName %>Demo extends Component {
         state = {
           clicks: 0
         };

         render() {
           const {clicks} = this.state;

           return (
             <<%= pascalCaseName %> onClick={() => this.setState({clicks: clicks + 1})}>
               {`<%= pascalCaseName %> (${clicks} clicks)`}
             </<%= pascalCaseName %>>
           );
         }
       }

       render(<<%= pascalCaseName %>Demo />, container);
     </file>
   </example>
 */

export default class <%= pascalCaseName %> extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames(styles.<%= camelCaseName %>, className);

    return (
      <div
        {...restProps}
        className={classes}
      >
        {children}
      </div>
    );
  }
}

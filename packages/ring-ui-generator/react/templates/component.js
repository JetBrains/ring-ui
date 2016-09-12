import React, {PropTypes} from 'react';
import classNames from 'classnames';

import RingComponent from '<%= ringUIRoot %>/ring-component/ring-component';

import './<%= paramCaseName %>.scss';

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
       import {render} from 'react-dom';
       import React from 'react';

       import <%= pascalCaseName %> from 'ring-ui/components/<%= paramCaseName %>/<%= paramCaseName %>';

       const container = document.getElementById('<%= paramCaseName %>');
       const render<%= pascalCaseName %>Demo = clicks => (
         <<%= pascalCaseName %>
           onClick={() => render(render<%= pascalCaseName %>Demo(++clicks), container)}
         >
           {`<%= pascalCaseName %> (${clicks} clicks)`}
         </<%= pascalCaseName %>>
       );

       render(render<%= pascalCaseName %>Demo(0), container);
     </file>
   </example>
 */

export default class <%= pascalCaseName %> extends RingComponent {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames('<%= className %>', className);

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


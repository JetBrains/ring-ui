import React, {PropTypes} from 'react';
import classNames from 'classnames';
import RingComponent from '../ring-component/ring-component';

import './panel.scss';

/**
 * @name Panel
 * @category Components
 * @constructor
 * @description Displays a button panel.
 * @extends {ReactComponent}
 * @example
   <example name="Panel">
     <file name="index.html">
       <div id="panel"></div>
     </file>

     <file name="index.js" webpack="true">
       import React from 'react';
       import {render} from 'react-dom';
       import Panel from 'ring-ui/components/panel/panel';
       import Button from 'ring-ui/components/legacy/button/button';

       render(
         (
           <Panel>
             <Button blue={true}>{'Apply changes'}</Button>
             <Button>{'Cancel'}</Button>
           </Panel>
         ),
         document.getElementById('panel')
       );
     </file>
   </example>
 */
export default class Panel extends RingComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {className, children, ...props} = this.props;
    const classes = classNames('ring-panel', className);
    return (
      <div
        {...props}
        className={classes}
      >
        {children}
      </div>
    );
  }
}

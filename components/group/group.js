import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './group.css';

/**
 * @name Group
 * @category Components
 * @tags 3.0
 * @framework React
 * @constructor
 * @description Places inner components with fixed spacing between
 * @example
   <example name="group">
     <file name="index.html">
       <div id="group"></div>
     </file>

     <file name="index.js">
       import React, {Component} from 'react';
       import {render} from 'react-dom';

       import Link from 'ring-ui/components/link/link';
       import Badge from 'ring-ui/components/badge/badge';
       import Group from 'ring-ui/components/group/group';

       const container = document.getElementById('group');
       class GroupDemo extends Component {
         render() {
           return (
             <Group>
               <Badge valid>Badge</Badge>
               <span>Text</span>
               <Link>Link</Link>
             </Group>
           );
         }
       }

       render(<GroupDemo />, container);
     </file>
   </example>
 */

export default class Group extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classNames(styles.group, className);

    return (
      <span
        {...restProps}
        className={classes}
      >
        {children}
      </span>
    );
  }
}

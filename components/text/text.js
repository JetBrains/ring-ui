import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './text.css';

/**
 * @name Text
 * @category Components
 * @framework React
 * @constructor
 * @description TODO add Text description
 * @example
   <example name="text">
     <file name="index.html">
       <div id="text"></div>
     </file>

     <file name="index.js">
       import React, {Component} from 'react';
       import {render} from 'react-dom';
       import Text from 'ring-ui/components/text/text';
       import Group from 'ring-ui/components/group/group';

       class TextDemo extends Component {
         render() {
           return (
             <div>
               <Group>
                 <Text>Bla bla bla</Text>
                 <Text comment>Bla bla bla</Text>
                 <Text info>Bla bla bla</Text>
               </Group>
             </div>
           );
         }
       }

       render(<TextDemo />, document.getElementById('text'));
     </file>
   </example>
 */

export default class Text extends Component {
  static propTypes = {
    children: PropTypes.node,
    comment: PropTypes.bool,
    info: PropTypes.bool,
    className: PropTypes.string
  };

  render() {
    const {children, className, comment, info} = this.props;
    const classes = classNames(styles.text, className, {
      [styles.comment]: comment,
      [styles.info]: info
    });

    return (
      <span className={classes}>{children}</span>
    );
  }
}

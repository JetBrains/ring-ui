import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './text.css';

/**
 * @name Text
 * @category Components
 * @framework React
 * @constructor
 * @description A component for rendering text content.
 * @example
   <example name="Text">
     <file name="index.html">
       <div id="text"></div>
     </file>

     <file name="index.js">
       import React, {Component} from 'react';
       import {render} from 'react-dom';
       import Text from '@jetbrains/ring-ui/components/text/text';
       import Group from '@jetbrains/ring-ui/components/group/group';

       class TextDemo extends Component {
         render() {
           return (
             <div>
               <Group>
                 <Text>Text</Text>
                 <Text comment>with a comment</Text>
                 <Text info>and an info message</Text>
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
    const {children, className, comment, info, ...restProps} = this.props;
    const classes = classNames(styles.text, className, {
      [styles.comment]: comment,
      [styles.info]: info
    });

    return (
      <span className={classes} {...restProps}>{children}</span>
    );
  }
}

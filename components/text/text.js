import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import deprecate from 'util-deprecate';

import styles from './text.css';

/**
 * @name Text
 * @category Components
 * @tags Ring UI Language
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
                 <Text info>with an info message</Text>
               </Group>
             </div>
           );
         }
       }

       render(<TextDemo />, document.getElementById('text'));
     </file>
   </example>
 */

const deprecateComment = deprecate(
  () => {},
  '<Text comment> is deprecated, use <Text info> instead'
);


export default class Text extends Component {
  static propTypes = {
    children: PropTypes.node,
    comment: PropTypes.bool,
    info: PropTypes.bool,
    className: PropTypes.string
  };

  render() {
    const {children, className, comment, info, ...restProps} = this.props;
    if (comment) {
      deprecateComment();
    }
    const classes = classNames(styles.text, className, {
      [styles.info]: info || comment
    });

    return (
      <span className={classes} {...restProps}>{children}</span>
    );
  }
}

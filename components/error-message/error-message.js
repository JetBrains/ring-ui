import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import Icon from '../icon/icon';
import Link from '../link/link';
import {Size, Color} from '../icon/icon__constants';

import styles from './error-message.css';


/**
 * @name Error Message
 * @category Components
 * @framework React
 * @constructor
 * @description TODO1 add Error Message description
 * @example
 <example name="error-message">
 <file name="index.html">
 <div id="error-message"></div>
 </file>

 <file name="index.js">
 import React, {Component} from 'react';
 import {render} from 'react-dom';

 import ErrorMessage from 'ring-ui/components/error-message/error-message';

 const container = document.getElementById('error-message');
 class ErrorMessageDemo extends Component {
         state = {
           clicks: 0
         };

         render() {
           const {clicks} = this.state;

           return (
             <ErrorMessage onClick={() => this.setState({clicks: clicks + 1})}>
               {`ErrorMessage (${clicks} clicks)`}
             </ErrorMessage>
           );
         }
       }

 render(<ErrorMessageDemo />, container);
 </file>
 </example>
 */

export default class ErrorMessage extends Component {
  static propTypes = {
    icon: PropTypes.string,
    code: PropTypes.string,
    message: PropTypes.string.isRequired,
    description: PropTypes.string,
    links: PropTypes.arrayOf(React.PropTypes.object),
    className: PropTypes.string
  };


  render() {
    const {className, icon, code, message, description, links} = this.props;
    const classes = classNames(styles.errorMessage, className);

    return (
      <div className={classes}>
        {icon &&
        <Icon className={styles.errorMessage__Icon}
          glyph={icon}
          size={Size.Size64}
          color={Color.GRAY}
        />
        }
        <div className={styles.errorMessage__Content}>
          <div className={styles.errorMessage__Title}>
            {code && `${code}:`} {message}
          </div>
          {description &&
          <div className={styles.errorMessage__Description}>
            {description}
          </div>
          }
          {links &&
          <div className={styles.errorMessage__Link}>
            {links.map(link =>
              <Link className={styles.errorMessage__Link}
                href={link.href ? link.href : '#'}
              >
                {link.text}
              </Link>)}
          </div>
          }
        </div>
      </div>
    );
  }
}

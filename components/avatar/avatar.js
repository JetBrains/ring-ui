import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

// TODO Exract to global
import {parseQueryString} from '../auth/auth__response-parser';
import {encodeURL} from '../auth/auth__request-builder';
import {getPixelRatio} from '../global/dom';

import styles from './avatar.css';

/**
 * @name Avatar
 * @category Components
 * @framework React
 * @constructor
 * @description TODO add Avatar description
 * @example
   <example name="avatar">
     <file name="index.html">
       <div id="avatar"></div>
     </file>

     <file name="index.css">
       :global(.avatar-demo) {
         display: flex;
         justify-content: space-between;
         width: 100px;
         margin-bottom: 16px;
       }

     </file>

     <file name="index.js">
       import React, {Component} from 'react';
       import {render} from 'react-dom';

       import Avatar, {Size} from 'ring-ui/components/avatar/avatar';
       import hubConfig from 'ring-ui/site/hub-config';

       const container = document.getElementById('avatar');

       class AvatarDemo extends Component {
         render() {
           const url = `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`

           return (
             <div>
                {Object.keys(Size).map(size => (
                  <div
                    className="avatar-demo"
                    key={size}
                  >
                    <Avatar size={Size[size]} url={url} />
                    <Avatar size={Size[size]} />
                  </div>
                ))}
             </div>
           );
         }
       }

       render(<AvatarDemo />, container);
     </file>
   </example>
 */

const Size = {
  Size18: 18,
  Size24: 24,
  Size32: 32,
  Size40: 40
};

export default class Avatar extends Component {
  static propTypes = {
    dpr: PropTypes.number,
    className: PropTypes.string,
    size: PropTypes.number,
    url: PropTypes.string
  };

  static defaultProps = {
    dpr: getPixelRatio()
  };

  render() {
    const {className, size = Size.Size18, url, dpr, ...restProps} = this.props;
    const classes = classNames(!url && styles.empty, className);
    const sizeString = `${size}px`;
    const style = {
      borderRadius: size <= Size.Size18 ? '2px' : '3px',
      height: sizeString,
      width: sizeString
    };

    if (!url) {
      return (
        <span
          className={classes}
          style={style}
        />
      );
    }

    const [urlStart, query] = url.split('?');
    const queryParams = {
      dpr,
      size,
      ...parseQueryString(query)
    };

    return (
      <img
        {...restProps}
        style={style}
        src={encodeURL(urlStart, queryParams)}
        className={classes}
      />
    );
  }
}

export {Size};

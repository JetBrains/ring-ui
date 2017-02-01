import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import {parseQueryString, encodeURL} from '../global/url';
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
    style: PropTypes.object,
    url: PropTypes.string
  };

  static defaultProps = {
    dpr: getPixelRatio()
  };

  state = {};

  handleError = error => {
    this.setState({error: error.nativeEvent.isTrusted});
  };

  render() {
    const {size = Size.Size18, url, dpr, style = {}, ...restProps} = this.props;
    const sizeString = `${size}px`;
    const styleObj = {
      borderRadius: size <= Size.Size18 ? '2px' : '3px',
      height: sizeString,
      width: sizeString,
      ...style
    };

    if (!url || this.state.error) {
      return (
        <span
          className={classNames(styles.empty, this.props.className)}
          style={styleObj}
        />
      );
    }

    const [urlStart, query] = url.split('?');
    const queryParams = {
      ...parseQueryString(query),
      dpr,
      size
    };

    return (
      <img
        {...restProps}
        onError={this.handleError}
        style={styleObj}
        src={encodeURL(urlStart, queryParams)}
      />
    );
  }
}

export {Size};

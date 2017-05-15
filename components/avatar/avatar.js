import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {encodeURL, isDataURI, parseQueryString} from '../global/url';
import {getPixelRatio} from '../global/dom';
import global from '../global/global.css';

import styles from './avatar.css';

/**
 * @name Avatar
 * @category Components
 * @framework React
 * @constructor
 * @description Displays an avatar or a box with border in case of failure.
 * @example
   <example name="avatar">
     <file name="index.html">
       <div id="avatar"></div>
     </file>

     <file name="index.css">
       :global(.avatar-demo) {
         display: flex;
         justify-content: space-between;
         width: 150px;
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
           const dataUri = `data:image/svg+xml,${encodeURIComponent('<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
            '<rect x="0" y="0" height="120" width="120" fill="#00cc00"/>' +
           '</svg>')}`;

           return (
             <div>
                {Object.keys(Size).map(size => (
                  <div
                    className="avatar-demo"
                    key={size}
                  >
                    <Avatar size={Size[size]} url={url} />
                    <Avatar size={Size[size]} url={dataUri} />
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

export const Size = {
  Size18: 18,
  Size20: 20,
  Size24: 24,
  Size32: 32,
  Size40: 40
};

export default class Avatar extends PureComponent {
  static propTypes = {
    dpr: PropTypes.number,
    className: PropTypes.string,
    size: PropTypes.number,
    style: PropTypes.object,
    url: PropTypes.string
  };

  static defaultProps = {
    dpr: getPixelRatio(),
    size: Size.Size20,
    style: {}
  };

  state = {
    errorUrl: ''
  };

  handleError = () => {
    this.setState({errorUrl: this.props.url});
  };

  handleSuccess = () => {
    this.setState({errorUrl: ''});
  };

  render() {
    const {size, url, dpr, style, ...restProps} = this.props;
    const sizeString = `${size}px`;
    const borderRaduis = size <= Size.Size18 ? 'border-radius-small' : 'border-radius';
    const styleObj = {
      borderRadius: global[borderRaduis],
      height: sizeString,
      width: sizeString,
      ...style
    };

    if (!url || this.state.errorUrl === url) {
      return (
        <span
          {...restProps}
          className={classNames(styles.empty, this.props.className)}
          style={styleObj}
        />
      );
    }

    let src = url;
    if (!isDataURI(url)) {
      const [urlStart, query] = url.split('?');
      const queryParams = {
        ...parseQueryString(query),
        dpr,
        size
      };

      src = encodeURL(urlStart, queryParams);
    }

    return (
      <img
        {...restProps}
        onError={this.handleError}
        onLoad={this.handleSuccess}
        style={styleObj}
        src={src}
      />
    );
  }
}

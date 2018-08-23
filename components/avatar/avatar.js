import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {encodeURL, isDataURI, parseQueryString} from '../global/url';
import {getPixelRatio} from '../global/dom';

import styles from './avatar.css';

/**
 * @name Avatar
 * @category Components
 * @tags Ring UI Language
 * @framework React
 * @constructor
 * @description Displays an avatar. In case of a loading error an empty square is displayed.
 * @example
   <example name="Avatar">
     <file name="index.html">
       <div id="avatar"></div>
     </file>

     <file name="index.css">
       :global(.avatar-demo) {
         display: flex;
         justify-content: space-between;
         width: 200px;
         margin-bottom: 16px;
       }
     </file>

     <file name="index.js">
       import React, {Component} from 'react';
       import {render} from 'react-dom';

       import Avatar, {Size} from '@jetbrains/ring-ui/components/avatar/avatar';
       import hubConfig from '@ring-ui/docs/components/hub-config';

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
                    <Avatar size={Size[size]} url={dataUri} round />
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
  Size40: 40,
  Size48: 48,
  Size56: 56
};

export default class Avatar extends PureComponent {
  static propTypes = {
    dpr: PropTypes.number,
    className: PropTypes.string,
    size: PropTypes.number,
    style: PropTypes.object,
    url: PropTypes.string,
    round: PropTypes.bool
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
    const {size, url, dpr, style, round, ...restProps} = this.props;
    const sizeString = `${size}px`;
    const borderRadius = size <= Size.Size18 ? 'var(--ring-border-radius-small)' : 'var(--ring-border-radius)';
    const styleObj = {
      borderRadius: round ? '50%' : borderRadius,
      height: sizeString,
      width: sizeString,
      ...style
    };

    if (!url || this.state.errorUrl === url) {
      return (
        <span
          {...restProps}
          className={classNames(styles.avatar, styles.empty, this.props.className)}
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
        className={classNames(styles.avatar, this.props.className)}
        style={styleObj}
        src={src}
      />
    );
  }
}

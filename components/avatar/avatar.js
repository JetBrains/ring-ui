import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {encodeURL, isDataURI, parseQueryString} from '../global/url';
import {getPixelRatio} from '../global/dom';

import styles from './avatar.css';

/**
 * @name Avatar
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
        alt="User avatar"
      />
    );
  }
}

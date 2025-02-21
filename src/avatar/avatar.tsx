import {PureComponent, ImgHTMLAttributes, ReactNode} from 'react';
import classNames from 'classnames';

import deprecate from 'util-deprecate';

import {encodeURL, isDataURI, parseQueryString} from '../global/url';
import {getPixelRatio} from '../global/dom';

import memoize from '../global/memoize';

import styles from './avatar.css';
import FallbackAvatar from './fallback-avatar';
import {Size} from './avatar-size';
import AvatarInfo from './avatar-info';

export {Size};

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  dpr: number;
  size: Size | number;
  subavatarSize: number;
  url?: string | null | undefined;
  round?: boolean | null | undefined;
  subavatar?: string | null | undefined;
  username?: string | null | undefined;
  info?: ReactNode; // renders a avatar-like node with the provided content
  skipParams?: boolean | null | undefined;
}

const warnSize = memoize((size: Size) =>
  deprecate(
    () => {},
    `Avatar: Size${size} is deprecated and will be removed in 8.0. The supported sizes are: Size20, Size24, Size28, Size32, Size40.`,
  ),
);

export default class Avatar extends PureComponent<AvatarProps> {
  static defaultProps = {
    dpr: getPixelRatio(),
    size: Size.Size20,
    subavatarSize: Size.Size20 / 2,
    style: {},
  };

  state = {
    errorUrl: '',
  };

  handleError = () => {
    this.setState({errorUrl: this.props.url});
  };

  handleSuccess = () => {
    this.setState({errorUrl: ''});
  };

  render() {
    const {size, url, dpr, style, round, subavatar, subavatarSize, username, info, skipParams, ...restProps} =
      this.props;
    if ([Size.Size18, Size.Size48].includes(size)) {
      warnSize(size)();
    }
    const sizeString = `${size}px`;
    const subavatarSizeString = `${subavatarSize}px`;
    const styleObj = {
      height: sizeString,
      width: sizeString,
      ...style,
    };

    const styleObjGroup = {
      borderRadius: '2px',
      height: subavatarSizeString,
      width: subavatarSizeString,
      ...style,
    };

    const classes = classNames(styles.avatar, this.props.className, {
      [styles.round]: round,
    });

    if (!url || this.state.errorUrl === url) {
      return (
        <span
          {...restProps}
          data-test="avatar"
          className={classNames(classes, {
            [styles.empty]: username == null && info == null,
          })}
          style={styleObj}
        >
          {username != null && <FallbackAvatar size={size} round={round} username={username} />}
          {info != null && <AvatarInfo size={size}>{info}</AvatarInfo>}
        </span>
      );
    }

    let src = url;
    if (!skipParams && !isDataURI(url)) {
      const [urlStart, query] = url.split('?');
      const queryParams = {
        ...parseQueryString(query),
        dpr,
        size,
      };

      src = encodeURL(urlStart, queryParams);
    }
    let subavatarSrc = null;
    if (subavatar && !isDataURI(subavatar)) {
      const [urlStart, query] = subavatar.split('?');
      const queryParams = {
        ...parseQueryString(query),
        dpr,
        subavatarSizeString,
      };

      subavatarSrc = skipParams ? subavatar : encodeURL(urlStart, queryParams);
      return (
        <div>
          <img
            {...restProps}
            onError={this.handleError}
            onLoad={this.handleSuccess}
            className={classNames(classes, styles.avatarShadow)}
            style={styleObj}
            src={src}
            alt="User avatar"
          />
          <img
            {...restProps}
            data-test="avatar"
            onError={this.handleError}
            onLoad={this.handleSuccess}
            className={classNames(styles.subavatar)}
            style={styleObjGroup}
            src={subavatarSrc}
            alt="Subavatar"
          />
        </div>
      );
    } else {
      return (
        <img
          {...restProps}
          data-test="avatar"
          onError={this.handleError}
          onLoad={this.handleSuccess}
          className={classNames(classes, styles.avatarShadow)}
          style={styleObj}
          src={src}
          alt="User avatar"
        />
      );
    }
  }
}

export type AvatarAttrs = React.JSX.LibraryManagedAttributes<typeof Avatar, AvatarProps>;

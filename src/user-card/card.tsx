import React, {HTMLAttributes, PureComponent, ReactElement} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import copyIcon from '@jetbrains/icons/copy';

import Avatar, {Size as AvatarSize} from '../avatar/avatar';
import Link from '../link/link';
import clipboard from '../clipboard/clipboard';
import badgeStyles from '../badge/badge.css';
import Icon, {Size as IconSize} from '../icon/icon';

import styles from './user-card.css';

export interface UserCardUser {
  name: string
  login: string
  avatarUrl?: string | null | undefined
  email?: string | null | undefined
  href?: string | null | undefined
  online?: boolean | null | undefined
  banned?: boolean | null | undefined
  banReason?: string | undefined
  unverifiedEmail?: boolean | null | undefined
}
export interface UserCardWording {
  banned: string
  online: string
  offline: string
  copyToClipboard: string
  copiedToClipboard: string
  copingToClipboardError: string
  unverified: string
}
export interface UserCardProps extends HTMLAttributes<HTMLDivElement> {
  user: UserCardUser
  wording: UserCardWording
  info?: ReactElement | readonly ReactElement[] | string,
  'data-test'?: string | null | undefined
}
export default class UserCard extends PureComponent<UserCardProps> {
  static propTypes = {
    children: PropTypes.node,
    info: PropTypes.node,
    className: PropTypes.string,

    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      login: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired,
      email: PropTypes.string,
      href: PropTypes.string,
      online: PropTypes.bool,
      banned: PropTypes.bool,
      banReason: PropTypes.string,
      unverifiedEmail: PropTypes.bool
    }).isRequired,

    wording: PropTypes.shape({
      banned: PropTypes.string.isRequired,
      online: PropTypes.string.isRequired,
      offline: PropTypes.string.isRequired,
      copyToClipboard: PropTypes.string.isRequired,
      copiedToClipboard: PropTypes.string.isRequired,
      copingToClipboardError: PropTypes.string.isRequired,
      unverified: PropTypes.string
    })
  };

  static defaultProps = {
    wording: {
      banned: 'banned',
      online: 'online',
      offline: 'offline',
      copyToClipboard: 'Copy to clipboard',
      copiedToClipboard: 'Email was copied to clipboard',
      copingToClipboardError: 'Failed to copy to clipboard',
      unverified: 'Unverified'
    }
  };

  copyEmail = () => {
    const {user, wording} = this.props;
    clipboard.copyText(user.email || '', wording.copiedToClipboard, wording.copingToClipboardError);
  };

  render() {
    const {children, info, className, user, wording, ...restProps} = this.props;

    const classes = classNames(className, {});
    const userActiveStatusClasses = classNames(
      styles.userActiveStatus,
      user.online ? styles.online : ''
    );

    return (
      <div className={classes} {...restProps}>
        <div className={styles.userInformationContainer}>
          <Avatar
            size={AvatarSize.Size56}
            url={user.avatarUrl}
          />
          <div className={styles.userInformation}>
            <div className={styles.userNameLine}>
              {user.href && (
                <Link
                  href={user.href}
                  className={styles.userName}
                >
                  {user.name}
                </Link>
              )}
              {!user.href && <span className={styles.userName}>{user.name}</span>}
              {
                typeof user.online === 'boolean' &&
                (
                  <span
                    className={userActiveStatusClasses}
                    title={user.online ? wording.online : wording.offline}
                  />
                )
              }
              {!!info && <span className={styles.userNameInfo}>{info}</span>}
              {
                user.banned &&
                (
                  <span
                    className={classNames(badgeStyles.badge, badgeStyles.invalid)}
                    title={user.banReason}
                  >{wording.banned}</span>
                )
              }
            </div>
            <div className={styles.userLogin}>{user.login}</div>
            {user.email && (
              <span
                className={styles.userEmailWrapper}
              >
                <Link
                  pseudo
                  onClick={this.copyEmail}
                  className={styles.userEmail}
                >
                  {user.email}
                </Link>
                {
                  user.unverifiedEmail && (
                    <span className={styles.unverifiedLabel}>{wording.unverified}</span>
                  )
                }
                <Icon
                  title={wording.copyToClipboard}
                  className={styles.userCopyIcon}
                  onClick={this.copyEmail}
                  glyph={copyIcon}
                  size={IconSize.Size14}
                  suppressSizeWarning
                />
              </span>
            )}
            {children}
          </div>
        </div>
      </div>
    );
  }
}
export type UserCardAttrs = JSX.LibraryManagedAttributes<typeof UserCard, UserCardProps>

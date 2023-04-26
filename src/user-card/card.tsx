import React, {HTMLAttributes, PureComponent, ReactElement} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import copyIcon from '@jetbrains/icons/copy';

import Avatar, {Size as AvatarSize} from '../avatar/avatar';
import Link from '../link/link';
import clipboard from '../clipboard/clipboard';
import badgeStyles from '../badge/badge.css';
import Icon, {Size as IconSize} from '../icon/icon';

import {I18nContext} from '../i18n/i18n-context';

import {Messages} from '../i18n/i18n';

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
  copyToClipboard?: string
  copiedToClipboard?: string
  copingToClipboardError?: string
  unverified?: string
}
export interface UserCardProps extends HTMLAttributes<HTMLDivElement> {
  user: UserCardUser
  wording?: UserCardWording | null | undefined // TODO: "wording" isn't the right name, to be replaced with "translations" in 6.0
  translations?: UserCardWording | null | undefined
  info?: ReactElement | readonly ReactElement[] | string,
  avatarInfo?: ReactElement | readonly ReactElement[] | string,
  'data-test'?: string | null | undefined
}

const translationsShape = PropTypes.shape({
  banned: PropTypes.string.isRequired,
  online: PropTypes.string.isRequired,
  offline: PropTypes.string.isRequired,
  copyToClipboard: PropTypes.string,
  copiedToClipboard: PropTypes.string,
  copingToClipboardError: PropTypes.string,
  unverified: PropTypes.string
});

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

    wording: translationsShape,
    translations: translationsShape
  };

  static contextType = I18nContext;

  copyEmail = () => {
    const messages = this.context as Messages;
    const messageOverrides = this.props.wording || this.props.translations;

    const wording = messageOverrides ?? messages;
    clipboard.copyText(
      this.props.user.email || '', wording.copiedToClipboard, wording.copingToClipboardError
    );
  };

  render() {
    const {children, info, className, user, avatarInfo, ...restProps} = this.props;
    const messages = this.context as Messages;
    const messageOverrides = this.props.wording || this.props.translations;

    const wording = messageOverrides ?? messages;

    const classes = classNames(className, {});
    const userActiveStatusClasses = classNames(
      styles.userActiveStatus,
      user.online ? styles.online : ''
    );

    return (
      <div className={classes} {...restProps}>
        <div className={styles.userInformationContainer}>
          <div className={styles.userAvatar}>
            <Avatar
              size={AvatarSize.Size56}
              url={user.avatarUrl}
              round
            />
            {!!avatarInfo && avatarInfo}
          </div>
          <div className={styles.userInformation}>
            <div className={styles.userInformationGeneral}>
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
                    href={`mailto:${user.email}`}
                    title={`mailto:${user.email}`}
                    target="_blank"
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
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
export type UserCardAttrs = JSX.LibraryManagedAttributes<typeof UserCard, UserCardProps>

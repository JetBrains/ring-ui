import {HTMLAttributes, PureComponent, ReactElement} from 'react';
import * as React from 'react';
import classNames from 'classnames';
import copyIcon from '@jetbrains/icons/copy';

import Avatar, {Size as AvatarSize} from '../avatar/avatar';
import Link from '../link/link';
import clipboard from '../clipboard/clipboard';
import Tag from '../tag/tag';
import Icon, {Size as IconSize} from '../icon/icon';
import {I18nContext} from '../i18n/i18n-context';
import Tooltip from '../tooltip/tooltip';

import styles from './user-card.css';

export interface UserCardUser {
  name: string;
  login: string;
  avatarUrl?: string | null | undefined;
  email?: string | null | undefined;
  href?: string | null | undefined;
  online?: boolean | null | undefined;
  banned?: boolean | null | undefined;
  banReason?: string | undefined;
  unverifiedEmail?: boolean | null | undefined;
}
export interface UserCardTranslations {
  banned: string;
  online: string;
  offline: string;
  copyToClipboard?: string;
  copiedToClipboard?: string;
  copingToClipboardError?: string;
  unverified?: string;
}
export interface UserCardProps extends HTMLAttributes<HTMLDivElement> {
  user: UserCardUser;
  translations?: UserCardTranslations | null | undefined;
  info?: ReactElement | readonly ReactElement[] | string;
  avatarInfo?: ReactElement | readonly ReactElement[] | string;
  'data-test'?: string | null | undefined;
}

export default class UserCard extends PureComponent<UserCardProps> {
  static contextType = I18nContext;
  declare context: React.ContextType<typeof UserCard.contextType>;

  copyEmail = () => {
    const {translate} = this.context;
    const translations = this.props.translations;

    clipboard.copyText(
      this.props.user.email || '',
      translations?.copiedToClipboard ?? translate('copyToClipboard'),
      translations?.copingToClipboardError ?? translate('copingToClipboardError'),
    );
  };

  render() {
    const {children, info, className, user, avatarInfo, ...restProps} = this.props;
    const {translate} = this.context;
    const translations = this.props.translations;

    const classes = classNames(className, {});
    const userActiveStatusClasses = classNames(styles.userActiveStatus, user.online ? styles.online : '');

    return (
      <div className={classes} {...restProps}>
        <div className={styles.userInformationContainer}>
          <div className={styles.userAvatar}>
            <Avatar size={AvatarSize.Size56} url={user.avatarUrl} round />
            {!!avatarInfo && avatarInfo}
          </div>
          <div className={styles.userInformation}>
            <div className={styles.userInformationGeneral}>
              <div className={styles.userNameLine}>
                {user.href && (
                  <Link href={user.href} className={styles.userName}>
                    {user.name}
                  </Link>
                )}
                {!user.href && <span className={styles.userName}>{user.name}</span>}
                {typeof user.online === 'boolean' && (
                  <span
                    className={userActiveStatusClasses}
                    title={
                      user.online
                        ? (translations?.online ?? translate('online'))
                        : (translations?.offline ?? translate('offline'))
                    }
                  />
                )}
                {!!info && <span className={styles.userNameInfo}>{info}</span>}
                {user.banned && (
                  <Tooltip title={user.banReason}>
                    <Tag className={styles.banLabel}>{translations?.banned ?? translate('banned')}</Tag>
                  </Tooltip>
                )}
              </div>
              <div className={styles.userLogin}>{user.login}</div>
              {user.email && (
                <span className={styles.userEmailWrapper}>
                  <Link
                    href={`mailto:${user.email}`}
                    title={`mailto:${user.email}`}
                    target="_blank"
                    className={styles.userEmail}
                  >
                    {user.email}
                  </Link>
                  {user.unverifiedEmail && (
                    <span className={styles.unverifiedLabel}>
                      {translations?.unverified ?? translate('unverified')}
                    </span>
                  )}
                  <Icon
                    title={translations?.copyToClipboard ?? translate('copyToClipboard')}
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
export type UserCardAttrs = React.JSX.LibraryManagedAttributes<typeof UserCard, UserCardProps>;

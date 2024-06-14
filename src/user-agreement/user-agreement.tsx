/**
 * @name User Agreement
 */

import {PureComponent, ReactNode} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Dialog from '../dialog/dialog';
import {Content, Header} from '../island/island';
import Panel from '../panel/panel';
import Button from '../button/button';

import {I18nContext} from '../i18n/i18n-context';

import style from './user-agreement.css';

function noop() {}

export interface UserAgreementTranslations {
  userAgreement: string
  accept: string
  decline: string
  close: string
  scrollToAccept: string
  remindLater: string
}

export interface UserAgreementProps {
  translations?: UserAgreementTranslations | null | undefined
  children: ReactNode
  show: boolean
  onAccept: () => void
  onDecline: () => void
  onClose: () => void
  preview?: boolean | null | undefined
  onRemindLater?: (() => void) | null | undefined
  className?: string | null | undefined
}
/**
 * A component that displays a user agreement dialog.
 */
export default class UserAgreement extends PureComponent<UserAgreementProps> {
  static propTypes = {
    show: PropTypes.bool,
    preview: PropTypes.bool,
    onAccept: PropTypes.func,
    onDecline: PropTypes.func,
    onClose: PropTypes.func,
    onRemindLater: PropTypes.func,
    translations: PropTypes.shape({
      userAgreement: PropTypes.string.isRequired,
      accept: PropTypes.string.isRequired,
      decline: PropTypes.string.isRequired,
      close: PropTypes.string.isRequired,
      scrollToAccept: PropTypes.string.isRequired,
      remindLater: PropTypes.string.isRequired
    }),
    className: PropTypes.string
  };

  static defaultProps = {
    show: false,
    onAccept: noop,
    onDecline: noop,
    onClose: noop
  };

  state = {
    scrolledDown: false
  };

  onScrollToBottom = () => this.setState({scrolledDown: true});

  render() {
    const {scrolledDown} = this.state;
    const {
      translations,
      onAccept,
      onDecline,
      onClose,
      onRemindLater,
      children,
      show,
      preview,
      className
    } = this.props;

    return (
      <I18nContext.Consumer>
        {({translate}) => (
          <Dialog
            label={translations?.userAgreement ?? translate('userAgreement')}
            show={show}
            className={classNames(style.agreementDialog, className)}
            contentClassName={style.dialogContent}
            trapFocus
            autoFocusFirst={false}
            data-test="user-agreement"
          >
            <Header>{translations?.userAgreement ?? translate('userAgreement')}</Header>
            <Content
              fade
              onScrollToBottom={this.onScrollToBottom}
            >
              {children}
            </Content>
            {!preview && (
              <Panel>
                {onRemindLater && !scrolledDown && (
                  <div className={style.suggestion}>
                    {translations?.scrollToAccept ?? translate('scrollToAccept')}
                  </div>
                )}
                <Button primary disabled={!scrolledDown} onClick={onAccept} data-test="accept">
                  {translations?.accept ?? translate('accept')}
                </Button>
                <Button onClick={onDecline} autoFocus data-test="decline">
                  {translations?.decline ?? translate('decline')}
                </Button>

                {!onRemindLater && !scrolledDown && (
                  <span className={style.suggestion}>
                    {translations?.scrollToAccept ?? translate('scrollToAccept')}
                  </span>
                )}
                {onRemindLater && (
                  <Button
                    className={style.remindLaterButton}
                    onClick={onRemindLater}
                    data-test="later"
                  >
                    {translations?.remindLater ?? translate('remindLater')}
                  </Button>
                )}
              </Panel>
            )}
            {preview && (
              <Panel>
                <Button onClick={onClose} autoFocus data-test="close">
                  {translations?.close ?? translate('close')}
                </Button>
              </Panel>
            )}
          </Dialog>
        )}
      </I18nContext.Consumer>
    );
  }
}
export type UserAgreementAttrs =
  JSX.LibraryManagedAttributes<typeof UserAgreement, UserAgreementProps>

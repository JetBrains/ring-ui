/**
 * @name User Agreement
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Dialog from '../dialog/dialog';
import {Content, Header} from '../island/island';
import Panel from '../panel/panel';
import Button from '../button/button';
import Markdown from '../markdown/markdown';

import style from './user-agreement.css';

export default class UserAgreement extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    preview: PropTypes.bool,
    text: PropTypes.string.isRequired,
    onAccept: PropTypes.func.isRequired,
    onDecline: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onRemindLater: PropTypes.func,
    translations: PropTypes.object
  };

  static defaultProps = {
    translations: {
      accept: 'Accept',
      decline: 'Decline',
      close: 'Close',
      scrollToAccept: 'View the entire agreement to continue',
      remindLater: 'Remind me later'
    },
    show: false
  };

  state = {
    scrolledDown: false
  };

  onScrollToBottom = () => this.setState({scrolledDown: true});

  render() {
    const {scrolledDown} = this.state;
    // eslint-disable-next-line max-len
    const {translations, onAccept, onDecline, onClose, onRemindLater, text, show, preview} = this.props;

    return (
      <Dialog
        show={show}
        contentClassName={style.dialogContent}
        trapFocus
        autoFocusFirst={false}
      >
        <Header>&nbsp;</Header>
        <Content
          scrollableWrapperClassName={style.scrollableWrapper}
          fade
          onScrollToBottom={this.onScrollToBottom}
        >
          <Markdown source={text} tabindex={-1}/>
        </Content>
        {!preview && (
          <Panel>
            {onRemindLater && !scrolledDown && (
              <div className={style.suggestion}>{translations.scrollToAccept}</div>
            )}
            <Button primary disabled={!scrolledDown} onClick={onAccept} data-test="accept">
              {translations.accept}
            </Button>
            <Button onClick={onDecline} autoFocus data-test="decline">
              {translations.decline}
            </Button>

            {!onRemindLater && !scrolledDown && (
              <span className={style.suggestion}>{translations.scrollToAccept}</span>
            )}
            {onRemindLater && (
              <Button className={style.remindLaterButton} onClick={onRemindLater} data-test="later">
                {translations.remindLater}
              </Button>
            )}
          </Panel>
        )}
        {preview && (
          <Panel>
            <Button onClick={onClose} autoFocus data-test="close">{translations.close}</Button>
          </Panel>
        )}
      </Dialog>
    );
  }
}

/**
 * @name User Agreement
 * @category Components
 * @framework React
 * @tags Ring UI Language
 * @constructor
 * @description A component that displays a user agreement dialog.
 * @example-file ./user-agreement.examples.html
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
    translations: PropTypes.object
  };

  static defaultProps = {
    translations: {
      accept: 'Accept',
      decline: 'Decline',
      close: 'Close',
      scrollToAccept: 'View the entire agreement to continue'
    },
    show: false
  };

  state = {
    scrolledDown: false
  };

  onScrollToBottom = () => this.setState({scrolledDown: true});

  render() {
    const {scrolledDown} = this.state;
    const {translations, onAccept, onDecline, onClose, text, show, preview} = this.props;

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
            <Button primary disabled={!scrolledDown} onClick={onAccept}>
              {translations.accept}
            </Button>
            <Button onClick={onDecline} autoFocus>{translations.decline}</Button>
            {!scrolledDown && (
              <span className={style.suggestion}>{translations.scrollToAccept}</span>
            )}
          </Panel>
        )}
        {preview && (
          <Panel>
            <Button onClick={onClose} autoFocus>{translations.close}</Button>
          </Panel>
        )}
      </Dialog>
    );
  }
}

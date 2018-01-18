import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Dialog from '../dialog/dialog';
import {Content} from '../island/island';
import Panel from '../panel/panel';
import Button from '../button/button';
import Markdown from '../markdown/markdown';

import style from './user-agreement.css';

export default class UserAgreement extends PureComponent {
  static propTypes = {
    show: PropTypes.bool,
    text: PropTypes.string.isRequired,
    onAccept: PropTypes.func.isRequired,
    onDecline: PropTypes.func.isRequired,
    translations: PropTypes.object
  };

  static defaultProps = {
    show: false,
    translations: {
      accept: 'Accept',
      decline: 'Decline'
    }
  };

  render() {
    const {show, text, translations, onAccept, onDecline} = this.props;

    return (
      <Dialog show={show} contentClassName={style.dialogContent}>
        <Content>
          <Markdown source={text} className={style.text}/>
        </Content>
        <Panel>
          <Button blue onClick={onAccept}>{translations.accept}</Button>
          <Button onClick={onDecline}>{translations.decline}</Button>
        </Panel>
      </Dialog>
    );
  }
}

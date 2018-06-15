import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Dialog from '../dialog/dialog';
import {Content} from '../island/island';
import LoaderScreen from '../loader-screen/loader-screen';
import {HUB_AUTH_PAGE_OPENED} from '../auth/background-flow';

import styles from './login-dialog.css';

const HUB_AUTH_PAGE_LOGIN_STARTED = 'HUB_AUTH_PAGE_LOGIN_STARTED';
const HUB_AUTH_PAGE_LOGIN_DIMENSIONS = 'HUB_AUTH_PAGE_LOGIN_DIMENSIONS';

const DEFAULT_HEIGHT = 517;
const DEFAULT_WIDTH = 333;
const SHOW_FALLBACK_TIMEOUT = 2000;
/**
 * @name Login Dialog
 * @category Components
 * @framework React
 * @constructor
 * @description A component that shows an authentication form.
 */

export default class LoginDialog extends Component {
  static propTypes = {
    show: PropTypes.bool,
    className: PropTypes.string,
    url: PropTypes.string,
    loader: PropTypes.bool,
    loadingMessage: PropTypes.string,
    renderFallbackLink: PropTypes.func,
    onCancel: PropTypes.func.isRequired
  };

  static defaultProps = {
    show: false,
    url: 'about:blank',
    renderFallbackLink: () => null
  };

  state = {
    loading: true,
    showFallbackLink: false,
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH
  };

  componentDidMount() {
    window.addEventListener('message', this.onMessage);

    this.showFallbackTimout = setTimeout(
      () => this.setState({showFallbackLink: true}),
      SHOW_FALLBACK_TIMEOUT
    );
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  }

  onMessage = event => {
    const {data} = event;
    if (!data) {
      return;
    }

    if (data === HUB_AUTH_PAGE_OPENED) {
      clearTimeout(this.showFallbackTimout);
      this.setState({loading: false});
      return;
    }

    if (data === HUB_AUTH_PAGE_LOGIN_STARTED) {
      this.setState({loading: true});
      return;
    }

    if (data.message === HUB_AUTH_PAGE_LOGIN_DIMENSIONS) {
      this.setState({height: data.height, width: data.width});
    }
  };

  render() {
    const {show, className, url, loadingMessage, renderFallbackLink, onCancel} = this.props;
    const {loading, height, width, showFallbackLink} = this.state;

    const iFrameStyle = {height, width};

    return (
      <Dialog
        data-test="ring-login-dialog"
        className={className}
        contentClassName={styles.dialogContent}
        trapFocus
        autoFocusFirst={false}
        show={show}
        showCloseButton
        onCloseAttempt={onCancel}
      >
        <Content>
          <iframe
            style={iFrameStyle}
            src={url}
            className={styles.iFrame}
            scrolling="no"
          />
        </Content>

        {loading && (
          <LoaderScreen message={loadingMessage} containerClassName={styles.nonOpaqueLoader}/>
        )}

        {showFallbackLink && (
          <div className={styles.fallbackLinkContainer}>{renderFallbackLink()}</div>
        )}
      </Dialog>
    );
  }
}


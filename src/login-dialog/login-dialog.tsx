import {Component, ReactNode} from 'react';

import Dialog from '../dialog/dialog';
import {Content} from '../island/island';
import LoaderScreen from '../loader-screen/loader-screen';
import {HUB_AUTH_PAGE_OPENED} from '../auth/background-flow';

import styles from './login-dialog.css';

const HUB_AUTH_PAGE_LOGIN_STARTED = 'HUB_AUTH_PAGE_LOGIN_STARTED';
const HUB_AUTH_PAGE_LOGIN_DIMENSIONS = 'HUB_AUTH_PAGE_LOGIN_DIMENSIONS';

const DEFAULT_HEIGHT = 517;
const DEFAULT_WIDTH = 333;
const DEFAULT_SHOW_FALLBACK_TIMEOUT = 5000;

export interface LoginDialogProps {
  onCancel: () => void
  show: boolean,
  url: string,
  renderFallbackLink: (loggingIn: boolean) => ReactNode,
  showFallbackTimeout: number,
  className?: string | undefined,
  loader?: boolean | null | undefined,
  loadingMessage?: string | null | undefined,
}

/**
 * @name Login Dialog
 */

export default class LoginDialog extends Component<LoginDialogProps> {
  static defaultProps = {
    show: false,
    url: 'about:blank',
    renderFallbackLink: () => null,
    showFallbackTimeout: DEFAULT_SHOW_FALLBACK_TIMEOUT
  };

  state = {
    loading: true,
    loggingIn: false,
    showFallbackLink: false,
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH
  };

  componentDidMount() {
    window.addEventListener('message', this.onMessage);
    this.startFallbackCountdown();
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage);
  }

  showFallbackTimout?: number;
  startFallbackCountdown() {
    this.showFallbackTimout = window.setTimeout(
      () => this.setState({showFallbackLink: true}),
      this.props.showFallbackTimeout
    );
  }

  onMessage = (event: MessageEvent) => {
    const {data} = event;
    if (!data) {
      return;
    }

    if (data === HUB_AUTH_PAGE_OPENED) {
      clearTimeout(this.showFallbackTimout);
      this.setState({loading: false, loggingIn: false});
      return;
    }

    if (data === HUB_AUTH_PAGE_LOGIN_STARTED) {
      this.setState({loading: true, loggingIn: true});
      this.startFallbackCountdown();
      return;
    }

    if (data.message === HUB_AUTH_PAGE_LOGIN_DIMENSIONS) {
      this.setState({height: data.height, width: data.width});
    }
  };

  render() {
    const {show, className, url, loadingMessage, renderFallbackLink, onCancel} = this.props;
    const {loading, height, width, loggingIn, showFallbackLink} = this.state;

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
            title="Login dialog"
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
          <div className={styles.fallbackLinkContainer}>{renderFallbackLink(loggingIn)}</div>
        )}
      </Dialog>
    );
  }
}

export type LoginDialogAttrs = JSX.LibraryManagedAttributes<typeof LoginDialog, LoginDialogProps>

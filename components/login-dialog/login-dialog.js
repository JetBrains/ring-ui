import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Dialog from '../dialog/dialog';
import {Content} from '../island/island';
import LoaderScreen from '../loader-screen/loader-screen';

import styles from './login-dialog.css';

const HEIGHT = 700;
const WIDTH = 500;
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
    onCancel: PropTypes.func
  };

  static defaultProps = {
    show: false,
    url: 'about:blank'
  };

  onEscPress = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  render() {
    const {show, className, url, loader} = this.props;

    return (
      <Dialog
        data-test="ring-login-dialog"
        className={className}
        contentClassName={styles.dialogContent}
        onEscPress={this.onEscPress}
        trapFocus={false}
        show={show}
      >

        {loader && <LoaderScreen/>}

        <Content>
          <iframe
            height={HEIGHT}
            width={WIDTH}
            src={url}
            className={styles.iFrame}
          />
        </Content>
      </Dialog>
    );
  }
}


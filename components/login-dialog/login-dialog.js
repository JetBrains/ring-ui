import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Dialog from '../dialog/dialog';

import styles from './login-dialog.css';

const HEIGHT = 700;
const WIDTH = 350;
/**
 * @name Login Dialog
 * @category Components
 * @framework React
 * @constructor
 * @description A component that shows an authentication form.
 */

export default class AuthDialog extends Component {
  static propTypes = {
    show: PropTypes.bool,
    className: PropTypes.string,
    url: PropTypes.string,
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
    const {
      show,
      className,
      url
    } = this.props;

    return (
      <Dialog
        data-test="ring-login-dialog"
        className={className}
        contentClassName={classNames(className)}
        onEscPress={this.onEscPress}
        trapFocus={false}
        show={show}
      >
        <div>
          <iframe
            height={HEIGHT}
            width={WIDTH}
            src={url}
            className={styles.iFrame}
          />
        </div>
      </Dialog>
    );
  }
}


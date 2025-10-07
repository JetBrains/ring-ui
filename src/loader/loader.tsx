import {type HTMLAttributes, PureComponent} from 'react';
import classNames from 'classnames';

import LoaderCore, {type LoaderCoreProps} from './loader-core';

import styles from './loader.css';

declare module 'csstype' {
  interface Properties {
    '--ring-loader-color-1'?: string;
    '--ring-loader-color-2'?: string;
    '--ring-loader-color-3'?: string;
  }
}

export interface LoaderProps extends Partial<LoaderCoreProps>, HTMLAttributes<HTMLElement> {
  'data-test'?: string | null | undefined;
  squares?: boolean; // TODO make default in 8.0
}

/**
 * @name Loader
 */
/**
 * Displays a large animated loader with an optional caption. Typical use cases: page loading animation, major action animation.
 */
export default class Loader extends PureComponent<LoaderProps> {
  componentDidUpdate(prevProps: LoaderProps) {
    if (this.loader) {
      if (!prevProps.stop && this.props.stop) {
        this.loader.stopAnimation();
      } else if (prevProps.stop && !this.props.stop) {
        this.loader.startAnimation();
      }
    }
  }

  componentWillUnmount() {
    this.loader?.destroy();
  }

  loader?: LoaderCore;
  initLoader = (el: Node | null) => {
    if (el) {
      this.loader = new LoaderCore(el, this.props);
    }
  };

  render() {
    const {message, size, colors, 'data-test': dataTest, stop, deterministic, squares, ...restProps} = this.props;

    return squares ? (
      <div {...restProps}>
        <div
          className={classNames(styles.canvas, styles.squares)}
          style={{
            '--ring-loader-color-1': colors?.[0] ? `rgb(${colors[0].r}, ${colors[0].g}, ${colors[0].b})` : undefined,
            '--ring-loader-color-2': colors?.[1] ? `rgb(${colors[1].r}, ${colors[1].g}, ${colors[1].b})` : undefined,
            '--ring-loader-color-3': colors?.[2] ? `rgb(${colors[2].r}, ${colors[2].g}, ${colors[2].b})` : undefined,
          }}
        >
          <div className={classNames(styles.square, styles.outer)} />
          <div className={classNames(styles.square, styles.middle)} />
          <div className={classNames(styles.square, styles.inner)} />
        </div>
        {message && <div className={styles.text}>{message}</div>}
      </div>
    ) : (
      <div {...restProps} ref={this.initLoader} />
    );
  }
}

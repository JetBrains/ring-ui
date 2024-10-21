import {HTMLAttributes, PureComponent} from 'react';

import dataTests from '../global/data-tests';

import LoaderCore, {LoaderCoreProps} from './loader__core';

export interface LoaderProps extends Partial<LoaderCoreProps>, HTMLAttributes<HTMLElement> {
  'data-test'?: string | null | undefined;
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
    const {message, size, colors, 'data-test': dataTest, stop, deterministic, ...restProps} = this.props;

    return <div data-test={dataTests('ring-loader', dataTest)} {...restProps} ref={this.initLoader} />;
  }
}

import {Component, HTMLAttributes} from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import adaptiveIslandHOC from './adaptive-island-hoc';

import styles from './island.css';

export interface IslandProps extends HTMLAttributes<HTMLElement> {
  narrow?: boolean | null | undefined
  withoutPaddings?: boolean | null | undefined
  'data-test'?: string | null | undefined
}

/**
 * @name Island
 */

export default class Island extends Component<IslandProps> {
  render() {
    const {
      children,
      className,
      narrow,
      withoutPaddings,
      'data-test': dataTest,
      ...restProps
    } = this.props;
    const classes = classNames(styles.island, className, {
      [styles.narrowIsland]: narrow,
      [styles.withoutPaddings]: withoutPaddings
    });

    return (
      <div
        {...restProps}
        className={classes}
        data-test={dataTests('ring-island', dataTest)}
      >
        {children}
      </div>
    );
  }
}

export const AdaptiveIsland = adaptiveIslandHOC(Island);

export {default as Header} from './header';
export {default as Content} from './content';

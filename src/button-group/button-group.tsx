import {PureComponent, type HTMLAttributes, type ReactNode, Children, type ReactElement} from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';
import ControlLabel from '../control-label/control-label';
import ControlHelp from '../control-help/control-help';
import Caption from './caption';

import styles from './button-group.css';

export interface ButtonGroupProps extends HTMLAttributes<HTMLElement> {
  split?: boolean | null | undefined;
  'data-test'?: string | null | undefined;
  label?: ReactNode;
  help?: ReactNode;
}

function allChildrenDisabled(children: ReactNode): boolean {
  if (!children || typeof children !== 'object') return false;
  if ('props' in children) {
    const {props} = children as ReactElement<Record<string, unknown>>;
    if ('disabled' in props) {
      return !!props.disabled;
    }
    return allChildrenDisabled(props.children as ReactNode);
  }
  const real = Children.toArray(children);
  return real.length > 0 && real.every(allChildrenDisabled);
}

/**
 * @name Button Group
 */
export default class ButtonGroup extends PureComponent<ButtonGroupProps> {
  render() {
    const {className, split, 'data-test': dataTest, label, help, ...restProps} = this.props;
    const classes = classNames(split ? styles.split : styles.buttonGroup, className, {
      [styles.disabled]: allChildrenDisabled(this.props.children),
    });

    return (
      <>
        {label && <ControlLabel>{label}</ControlLabel>}
        <div {...restProps} data-test={dataTests('ring-button-group', dataTest)} className={classes} />
        {help && <ControlHelp className={styles.help}>{help}</ControlHelp>}
      </>
    );
  }
}

export {Caption};

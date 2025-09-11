import {type InputHTMLAttributes, PureComponent, type ReactNode} from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';
import ControlHelp from '../control-help/control-help';
import styles from './toggle.css';

export const Size = {
  Size14: styles.size14,
  Size16: styles.size16,
  Size20: styles.size20,
};

/**
 * @name Toggle
 */

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size: string;
  leftLabel?: ReactNode;
  'data-test'?: string | null | undefined;
  help?: ReactNode;
}
class Toggle extends PureComponent<ToggleProps> {
  static defaultProps = {
    size: Size.Size16,
  };

  render() {
    const {
      className,
      children,
      disabled,
      title,
      leftLabel,
      size = Size.Size16,
      'data-test': dataTest,
      help,
      onTransitionEnd,
      ...restProps
    } = this.props;

    const classes = classNames(className, size, styles.toggle, disabled && styles.disabled);

    return (
      <label className={classes} title={title} data-test={dataTests('ring-toggle', dataTest)}>
        {leftLabel && (
          <span className={styles.leftLabel}>
            {leftLabel}
            {help && <ControlHelp className={styles.help}>{help}</ControlHelp>}
          </span>
        )}

        <span className={styles.switchWrapper}>
          <input
            data-test='ring-toggle-input'
            {...restProps}
            type='checkbox'
            disabled={disabled}
            className={styles.input}
          />

          <span className={styles.switch} onTransitionEnd={onTransitionEnd} />
        </span>

        {children && (
          <div className={styles.label}>
            {children}
            {help && <ControlHelp className={styles.help}>{help}</ControlHelp>}
          </div>
        )}
      </label>
    );
  }
}
export type ToggleAttrs = React.JSX.LibraryManagedAttributes<typeof Toggle, ToggleProps>;
export default Toggle;

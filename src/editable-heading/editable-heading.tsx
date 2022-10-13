import React from 'react';
import classNames from 'classnames';

import Heading, {HeadingProps} from '../heading/heading';
import Button from '../button/button';
import {Size} from '../input/input';
import inputStyles from '../input/input.css';

import styles from './editable-heading.css';

export {Levels} from '../heading/heading';

export interface EditableHeadingProps extends Omit<HeadingProps, 'onChange'> {
  editing?: boolean;
  edited?: boolean;
  children?: string;
  placeholder?: string;
  embedded?: boolean;
  size?: Size;
  onEdit?: () => void;
  onChange?: (text: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export const EditableHeading = ({
  editing, edited, children, placeholder, className,
  embedded = false, size = Size.L,
  onEdit, onChange, onSave, onCancel,
  ...restProps
}: EditableHeadingProps) => {
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={classNames(styles.editableHeading, className)}>
      {editing
        ? (
          <input
            className={classNames(styles.input, [inputStyles[`size${size}`]])}
            value={children}
            onChange={onInputChange}
            placeholder={placeholder}
            autoFocus
          />
        )
        : (
          <Heading
            className={classNames(styles.heading, [inputStyles[`size${size}`]])}
            onClick={onEdit}
            {...restProps}
          >{children}</Heading>
        )
      }

      {editing && !embedded && (
        <>
          <Button
            className={styles.button}
            primary
            disabled={!edited || !children || children?.trim() === ''}
            onClick={onSave}
          >{'Save'}</Button>

          <Button
            className={styles.button}
            onClick={onCancel}
          >{'Cancel'}</Button>
        </>
      )}
    </div>
  );
};

export default React.memo(EditableHeading);

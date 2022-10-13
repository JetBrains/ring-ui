import React from 'react';
import classNames from 'classnames';

import Heading, {Levels} from '../heading/heading';
import Button from '../button/button';
import {Size} from '../input/input';
import inputStyles from '../input/input.css';
import {ControlsHeight} from '../global/controls-height';

import styles from './editable-heading.css';

export {Levels};

export interface EditableHeadingProps {
  level?: Levels;
  className?: string | null;
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
  level = Levels.H1, className, editing, edited, children,
  placeholder, embedded = false, size = Size.L,
  onEdit, onChange, onSave, onCancel
}: EditableHeadingProps) => {
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={classNames(styles.editableHeading, className)}>
      {editing
        ? (
          <input
            className={classNames(styles.input, [inputStyles[`size${size}`], [[styles[`level${level}`]]]])}
            value={children}
            onChange={onInputChange}
            placeholder={placeholder}
            autoFocus
          />
        )
        : (
          <Heading
            className={classNames(styles.heading, [inputStyles[`size${size}`]])}
            level={level}
            onClick={onEdit}
          >{children}</Heading>
        )
      }

      {editing && !embedded && (
        <>
          <Button
            height={ControlsHeight.M}
            className={styles.button}
            primary
            disabled={!edited || !children || children?.trim() === ''}
            onClick={onSave}
          >{'Save'}</Button>

          <Button
            height={ControlsHeight.M}
            className={styles.button}
            onClick={onCancel}
          >{'Cancel'}</Button>
        </>
      )}
    </div>
  );
};

export default React.memo(EditableHeading);

import React, {InputHTMLAttributes} from 'react';
import classNames from 'classnames';

import Heading, {Levels} from '../heading/heading';
import Button from '../button/button';
import {Size} from '../input/input';
import inputStyles from '../input/input.css';
import getUID from '../global/get-uid';
import Shortcuts from '../shortcuts/shortcuts';

import styles from './editable-heading.css';

export {Levels};

export type EditableHeadingProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'size'> & {
  level?: Levels;
  headingClassName?: string | null;
  inputClassName?: string | null;
  isEditing?: boolean;
  isSavingPossible?: boolean;
  isSaving?: boolean;
  children?: string;
  embedded?: boolean;
  size?: Size;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  'data-test'?: string | null;
  error?: string;
  renderMenu?: () => React.ReactNode;
};

function noop() {}

const shortcutsScope = getUID('ring-editable-heading-');

export const EditableHeading = (props: EditableHeadingProps) => {
  const {
    level = Levels.H1, className, headingClassName, inputClassName,
    isEditing, isSavingPossible, isSaving, children, embedded = false,
    size = Size.L, onEdit, onSave = noop, onCancel = noop,
    'data-test': dataTest, error, disabled,
    renderMenu = () => null, ...restProps
  } = props;

  const hasError = error !== undefined;

  const classes = classNames(styles.editableHeading, className, {
    [styles.fullSize]: size === Size.FULL,
    [styles.isEditing]: isEditing,
    [styles.error]: hasError,
    [styles.disabled]: disabled
  });

  const headingClasses = classNames(styles.heading, headingClassName);

  const inputClasses = classNames(
    'ring-js-shortcuts',
    styles.input,
    inputStyles[`size${size}`],
    styles[`level${level}`],
    inputClassName
  );

  const onClick = React.useCallback(() => {
    if (disabled || !onEdit) {
      return undefined;
    }

    return onEdit();
  }, [disabled, onEdit]);

  const isSaveDisabled =
    !isSavingPossible || !children || children.trim() === '' || hasError || isSaving;

  const isCancelDisabled = isSaving;

  return (
    <>
      <div className={classes}>
        {!disabled && isEditing
          ? (
            <>
              <Shortcuts
                map={{
                  enter: () => !isSaveDisabled && onSave(),
                  esc: () => !isCancelDisabled && onCancel()
                }}
                scope={shortcutsScope}
                disabled={isSaving}
              />

              <input
                className={inputClasses}
                value={children}
                data-test={dataTest}
                disabled={isSaving}
                {...restProps}
              />
            </>
          )
          : (
            <Heading
              className={headingClasses}
              level={level}
              onClick={onClick}
              data-test={dataTest}
            >{children}</Heading>
          )
        }

        {!isEditing && (
          renderMenu()
        )}

        {isEditing && !embedded && (
          <>
            <Button
              className={styles.button}
              primary
              disabled={isSaveDisabled}
              loader={isSaving}
              onClick={onSave}
            >{'Save'}</Button>

            <Button
              className={styles.button}
              disabled={isCancelDisabled}
              onClick={onCancel}
            >{'Cancel'}</Button>
          </>
        )}
      </div>

      {isEditing && error && (
        <div className={classNames(styles.errorText, inputStyles[`size${size}`])}>{error}</div>
      )}
    </>
  );
};

export default React.memo(EditableHeading);

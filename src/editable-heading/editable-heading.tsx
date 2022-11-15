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
export {Size};

export interface EditableHeadingTranslations {
  save: string;
  cancel: string;
}

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
  translations?: EditableHeadingTranslations;
};

function noop() {}

export const EditableHeading = (props: EditableHeadingProps) => {
  const {
    level = Levels.H1, className, headingClassName, inputClassName, children,
    isEditing = false, isSavingPossible = false, isSaving = false, embedded = false,
    size = Size.L, onEdit = noop, onSave = noop, onCancel = noop,
    autoFocus = true, 'data-test': dataTest, error, disabled,
    renderMenu = () => null,
    translations = {
      save: 'Save',
      cancel: 'Cancel'
    },
    ...restProps
  } = props;

  const [shortcutsScope] = React.useState(getUID('ring-editable-heading-'));
  const [isInFocus, setIsInFocus] = React.useState(false);

  const hasError = error !== undefined;

  const isSaveDisabled =
    !isSavingPossible || !children || children.trim() === '' || hasError || isSaving;

  const isCancelDisabled = isSaving;

  const isShortcutsDisabled = !isInFocus || isSaving;

  const shortcutsMap = React.useMemo(() => ({
    enter: isSaveDisabled ? noop : onSave,
    esc: isCancelDisabled ? noop : onCancel
  }), [isSaveDisabled, isCancelDisabled, onSave, onCancel]);

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

  const onHeadingClick = React.useCallback(() => {
    if (disabled) {
      return undefined;
    }

    return onEdit();
  }, [disabled, onEdit]);

  const onInputFocus = React.useCallback(() => {
    setIsInFocus(true);
  }, []);

  const onInputBlur = React.useCallback(() => {
    setIsInFocus(false);
  }, []);

  return (
    <>
      <div className={classes}>
        {!disabled && isEditing
          ? (
            <>
              <Shortcuts
                map={shortcutsMap}
                scope={shortcutsScope}
                disabled={isShortcutsDisabled}
              />

              <input
                className={inputClasses}
                value={children}
                autoFocus={autoFocus}
                data-test={dataTest}
                disabled={isSaving}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
                {...restProps}
              />
            </>
          )
          : (
            <Heading
              className={headingClasses}
              level={level}
              onClick={onHeadingClick}
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
            >{translations.save}</Button>

            <Button
              className={styles.button}
              disabled={isCancelDisabled}
              onClick={onCancel}
            >{translations.cancel}</Button>
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

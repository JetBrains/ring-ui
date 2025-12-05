import {type InputHTMLAttributes, useEffect} from 'react';
import * as React from 'react';
import classNames from 'classnames';

import Heading, {Levels} from '../heading/heading';
import Button from '../button/button';
import {Size} from '../input/input';
import getUID from '../global/get-uid';
import Shortcuts from '../shortcuts/shortcuts';
import useEventCallback from '../global/use-event-callback';

import inputStyles from '../input/input.css';
import styles from './editable-heading.css';

export {Levels};
export {Size};

export interface EditableHeadingTranslations {
  save: string;
  cancel: string;
}

export type EditableHeadingProps = Omit<
  InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
  'value' | 'size'
> & {
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
  multiline?: boolean;
  maxInputRows?: number;
  renderMenu?: () => React.ReactNode;
  translations?: EditableHeadingTranslations;
};

function noop() {}

// eslint-disable-next-line complexity
export const EditableHeading = (props: EditableHeadingProps) => {
  const {
    level = Levels.H1,
    className,
    headingClassName,
    inputClassName,
    children,
    isEditing = false,
    isSavingPossible = false,
    isSaving = false,
    embedded = false,
    size = Size.L,
    onEdit = noop,
    onSave = noop,
    onCancel = noop,
    autoFocus = true,
    'data-test': dataTest,
    error,
    disabled,
    multiline = false,
    renderMenu = () => null,
    onFocus,
    onBlur,
    onChange,
    onScroll,
    maxInputRows,
    translations = {
      save: 'Save',
      cancel: 'Cancel',
    },
    ...restProps
  } = props;

  const [shortcutsScope] = React.useState(getUID('ring-editable-heading-'));
  const [isInFocus, setIsInFocus] = React.useState(false);
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const [isInSelectionMode, setIsInSelectionMode] = React.useState(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = React.useState(false);
  const [isOverflow, setIsOverflow] = React.useState(false);

  const hasError = error !== undefined;

  const isSaveDisabled = !isSavingPossible || !children || children.trim() === '' || hasError || isSaving;

  const isCancelDisabled = isSaving;

  const isShortcutsDisabled = !isInFocus || isSaving;

  const shortcutsMap: Record<string, () => void> = {};
  if (!isSaveDisabled) {
    shortcutsMap.enter = onSave;
  }
  if (isCancelDisabled) {
    shortcutsMap.esc = onCancel;
  }

  const classes = classNames(styles.editableHeading, className, {
    [styles.fullSize]: isEditing && size === Size.FULL,
    [styles.isEditing]: isEditing,
    [styles.error]: hasError,
    [styles.disabled]: disabled,
    [styles.multiline]: multiline,
    [styles.selectionMode]: isInSelectionMode,
  });

  const headingClasses = classNames(styles.heading, headingClassName, styles[`size${size}`]);

  const inputClasses = classNames(
    'ring-js-shortcuts',
    styles.input,
    styles.textarea,
    {[styles.textareaNotOverflow]: !isOverflow},
    inputStyles[`size${size}`],
    styles[`level${level}`],
    inputClassName,
  );

  const stretch = (el: HTMLElement | null | undefined) => {
    if (!el || !el.style) {
      return;
    }

    el.style.height = '0';
    const {paddingTop, paddingBottom} = window.getComputedStyle(el);
    el.style.height = `${el.scrollHeight - parseFloat(paddingTop) - parseFloat(paddingBottom)}px`;
  };

  const checkValue = (el: HTMLElement | null | undefined) => {
    if (multiline && el && el.scrollHeight >= el.clientHeight) {
      stretch(el);
    }
  };

  const checkOverflow = (el: HTMLInputElement | HTMLTextAreaElement) => {
    const scrollHeight = el.scrollHeight || 0;
    const clientHeight = el.clientHeight || 0;
    const scrollTop = el.scrollTop || 0;

    setIsScrolledToBottom(scrollHeight - clientHeight <= scrollTop);
    setIsOverflow(scrollHeight > clientHeight);
  };

  const onHeadingMouseDown = () => {
    setIsMouseDown(true);
  };

  const onMouseMove = useEventCallback(() => {
    if (!isMouseDown) {
      return;
    }

    setIsInSelectionMode(true);
  });

  const onMouseUp = useEventCallback(() => {
    if (isMouseDown && !isInSelectionMode && !disabled) {
      onEdit();
    }

    setIsMouseDown(false);
    setIsInSelectionMode(false);
  });

  const onInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsInFocus(true);
    checkValue(e.target);
    checkOverflow(e.target as HTMLInputElement | HTMLTextAreaElement);
    onFocus?.(e);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    checkValue(e.target);
    checkOverflow(e.target as HTMLInputElement | HTMLTextAreaElement);
    onChange?.(e);
  };

  const onInputScroll = (e: React.UIEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    checkOverflow(e.target as HTMLInputElement | HTMLTextAreaElement);
    onScroll?.(e);
  };

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsInFocus(false);
    onBlur?.(e);
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return (
    <>
      <div className={classes}>
        {!disabled && isEditing ? (
          <>
            <Shortcuts map={shortcutsMap} scope={shortcutsScope} disabled={isShortcutsDisabled} />

            {!multiline ? (
              <input
                className={inputClasses}
                value={children}
                autoFocus={autoFocus}
                data-test={dataTest}
                disabled={isSaving}
                onChange={onChange}
                {...restProps}
                onFocus={onInputFocus}
                onBlur={onInputBlur}
              />
            ) : (
              <div className={classNames(styles.textareaWrapper, inputStyles[`size${size}`])}>
                <textarea
                  ref={textAreaRef}
                  className={inputClasses}
                  value={children}
                  autoFocus={autoFocus}
                  data-test={dataTest}
                  disabled={isSaving}
                  onChange={onInputChange}
                  {...restProps}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                  onScroll={onInputScroll}
                  style={{maxHeight: maxInputRows ? `${maxInputRows}lh` : ''}}
                />
                {!isScrolledToBottom && <div className={styles.textareaFade} />}
              </div>
            )}
          </>
        ) : (
          <button type='button' className={styles.headingWrapperButton} onMouseDown={onHeadingMouseDown}>
            <Heading className={headingClasses} level={level} data-test={dataTest}>
              {children}
            </Heading>
          </button>
        )}

        {!isEditing && renderMenu()}

        {isEditing && !embedded && (
          <>
            <Button className={styles.button} primary disabled={isSaveDisabled} loader={isSaving} onClick={onSave}>
              {translations.save}
            </Button>

            <Button className={styles.button} disabled={isCancelDisabled} onClick={onCancel}>
              {translations.cancel}
            </Button>
          </>
        )}
      </div>

      {isEditing && error && <div className={classNames(styles.errorText, inputStyles[`size${size}`])}>{error}</div>}
    </>
  );
};

export default React.memo(EditableHeading);

import {DragEventHandler, forwardRef, ReactNode, useCallback, useImperativeHandle, useRef, useState} from 'react';
import classNames from 'classnames';
import attachmentIcon from '@jetbrains/icons/attachment';

import Icon from '../icon';

import styles from './upload.css';

export type UploadVariant = 'empty' | 'error' | 'success';

interface Props {
  className?: string;
  onFilesSelected: (files: File[]) => void;
  onFilesRejected?: (files: File[]) => void;
  validate?: (file: File) => boolean; // return false if file is not valid
  multiple?: HTMLInputElement['multiple'];
  renderIcon?: () => ReactNode;
  accept?: HTMLInputElement['accept'];
  disabled?: boolean;
  variant?: UploadVariant;

  children?: ReactNode;
}

export type UploadHandle = {
  openFilePicker: () => void;
};

export const Upload = forwardRef<UploadHandle, Props>(function Upload(
  {
    children,
    className,
    onFilesSelected,
    onFilesRejected,
    validate = () => true,
    variant = 'empty',
    multiple,
    renderIcon = () => <Icon className={styles.attachmentIcon} glyph={attachmentIcon} />,
    accept,
    disabled,
  },
  ref,
) {
  const fleInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  useImperativeHandle(ref, () => ({openFilePicker: () => fleInputRef.current?.click()}), []);

  const handleSelectedFiles = useCallback(
    (files: File[]) => {
      if (!files.length) {
        return;
      }
      const rejected = files.filter(file => !validate(file));

      if (rejected.length > 0) {
        onFilesRejected?.(files);
        return;
      }

      onFilesSelected(files);
    },
    [onFilesRejected, onFilesSelected, validate],
  );

  const onDragEnter: DragEventHandler = useCallback(() => setDragOver(true), []);

  const onDragOver: DragEventHandler = useCallback(e => e.preventDefault(), []);

  const onDragLeave: DragEventHandler = useCallback(() => setDragOver(false), []);

  const onInputChange = useCallback(() => {
    setDragOver(false);
    if (fleInputRef.current?.files) {
      handleSelectedFiles(Array.from(fleInputRef.current.files));
    }
  }, [handleSelectedFiles]);

  return (
    <div
      className={classNames(className, styles.upload, {
        [styles.disabled]: disabled,
        [styles.dragOver]: dragOver,
        [styles.success]: variant === 'success',
        [styles.error]: variant === 'error',
      })}
      data-test="ring-upload"
    >
      <input
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        disabled={disabled}
        ref={fleInputRef}
        data-test="ring-file-input"
        multiple={multiple}
        accept={accept}
        onChange={onInputChange}
        type="file"
        autoComplete="off"
        aria-label="file-picker"
        className={styles.invisibleFileInput}
      />
      {renderIcon()}
      {children}
    </div>
  );
});

export default Upload;

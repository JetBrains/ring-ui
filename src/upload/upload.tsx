import {
  type DragEventHandler,
  forwardRef,
  type ReactNode,
  type Ref,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
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

interface InnerProps extends Props {
  forwardedRef: Ref<UploadHandle>;
}

export interface UploadHandle {
  openFilePicker: () => void;
}

const defaultRenderIcon = () => <Icon className={styles.attachmentIcon} glyph={attachmentIcon} />;

function UploadInner({
  children,
  className,
  onFilesSelected,
  onFilesRejected,
  validate = () => true,
  variant = 'empty',
  multiple,
  renderIcon = defaultRenderIcon,
  accept,
  disabled,
  forwardedRef,
}: InnerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  useImperativeHandle(forwardedRef, () => ({openFilePicker: () => fileInputRef.current?.click()}), []);

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
    if (fileInputRef.current?.files) {
      handleSelectedFiles(Array.from(fileInputRef.current.files));
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
      data-test='ring-upload'
    >
      <input
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        disabled={disabled}
        ref={fileInputRef}
        data-test='ring-file-input'
        multiple={multiple}
        accept={accept}
        onChange={onInputChange}
        type='file'
        autoComplete='off'
        aria-label='file-picker'
        className={styles.invisibleFileInput}
      />
      {renderIcon()}
      {children}
    </div>
  );
}
export const Upload = forwardRef<UploadHandle, Props>(function Upload(props, ref) {
  return <UploadInner {...props} forwardedRef={ref} />;
});

export default Upload;

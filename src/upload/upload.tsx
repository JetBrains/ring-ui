import {DragEventHandler, FunctionComponent, PropsWithChildren, useCallback, useRef, useState} from 'react';
import classNames from 'classnames';

import styles from './upload.css';

type Props = {
  className?: string;
  onFilesSelected: (files: File[]) => void;
  onFilesRejected?: (files: File[]) => void;
  multiple?: HTMLInputElement['multiple'];
  accept?: HTMLInputElement['accept'];
  disabled?: boolean;
};

export const Upload: FunctionComponent<PropsWithChildren<Props>> = ({
  children,
  className,
  onFilesSelected,
  onFilesRejected,
  multiple,
  accept,
  disabled,
}) => {
  const containerRef = useRef<HTMLButtonElement>(null);
  const fleInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleSelectedFiles = useCallback(
    (files: File[]) => {
      const accepted = files.filter(file => (accept ? accept.split(',').includes(file.type) : true));
      const rejected = files.filter(file => (accept ? !accept.split(',').includes(file.type) : false));

      if (!multiple && files.length > 1) {
        onFilesRejected?.(files);
        return;
      }

      if (accepted.length) {
        onFilesSelected(accepted);
      }
      if (rejected.length) {
        onFilesRejected?.(rejected);
      }
    },
    [accept, multiple, onFilesRejected, onFilesSelected],
  );

  const onDragEnter: DragEventHandler = useCallback(() => setDragOver(true), []);

  const onDragOver: DragEventHandler = useCallback(e => e.preventDefault(), []);

  const onDrop: DragEventHandler = useCallback(
    e => {
      setDragOver(false);
      e.preventDefault();

      const files = Array.from(e.dataTransfer.items)
        .filter(item => item.kind === 'file')
        .map(item => item.getAsFile())
        .filter(it => it != null);

      handleSelectedFiles(files);
    },
    [handleSelectedFiles],
  );

  const onDragLeave: DragEventHandler = useCallback(() => setDragOver(false), []);

  const onDropZoneClick = useCallback(() => fleInputRef.current?.click(), []);

  const onInputChange = useCallback(() => {
    if (fleInputRef.current?.files) {
      handleSelectedFiles(Array.from(fleInputRef.current.files));
    }
  }, [handleSelectedFiles]);

  return (
    <button
      type="button"
      className={classNames(className, styles.uploadButton, styles.upload, {
        [styles.dragOver]: dragOver,
      })}
      disabled={disabled}
      ref={containerRef}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onDropZoneClick}
      data-test="ring-upload"
    >
      <input
        disabled={disabled}
        ref={fleInputRef}
        data-test="ring-file-input"
        multiple={multiple}
        accept={accept}
        onChange={onInputChange}
        type="file"
        autoComplete="off"
        tabIndex={-1}
        className={styles.fileInput}
      />
      {children}
    </button>
  );
};

export default Upload;

import {
  createContext,
  DragEventHandler,
  FunctionComponent,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import styles from './upload.css';

export type PickFileState = 'empty' | 'error' | 'success';

type Props = {
  className?: string;
  onFilesSelected: (files: File[]) => void;
  onFilesRejected?: (files: File[]) => void;
  validate?: (file: File) => boolean; // return false or error message if file does is not valid
  multiple?: HTMLInputElement['multiple'];
  accept?: HTMLInputElement['accept'];
  disabled?: boolean;
  state?: PickFileState;

  children?: ReactNode;
};

type UploadContext = {openFilePicker: () => void};

export const UploadContext = createContext<UploadContext>({openFilePicker: () => {}});

export const Upload: FunctionComponent<Props> = ({
  children,
  className,
  onFilesSelected,
  onFilesRejected,
  validate,
  state = 'empty',
  multiple,
  accept,
  disabled,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fleInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleSelectedFiles = useCallback(
    (files: File[]) => {
      if (!files.length) {
        return;
      }
      const rejected = files.filter(file => (validate ? validate?.(file) !== true : false));

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

  const context: UploadContext = useMemo(
    () => ({
      openFilePicker: () => fleInputRef.current?.click(),
    }),
    [],
  );

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
        [styles.success]: state === 'success',
        [styles.error]: state === 'error',
      })}
      ref={containerRef}
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
        tabIndex={-1}
        className={styles.invisibleFileInput}
      />
      <UploadContext.Provider value={context}>{children}</UploadContext.Provider>
    </div>
  );
};

export default Upload;

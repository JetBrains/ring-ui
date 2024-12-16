import {DragEventHandler, PropsWithChildren, useState} from 'react';
import * as React from 'react';
import classNames from 'classnames';

import styles from './upload.css';

type Props = {
  className?: string;
  onFilesSelected: (files: File[]) => void;
  validateFiles?: (files: File[]) => null | string;
};

export const Upload: React.FC<PropsWithChildren<Props>> = ({children, className, onFilesSelected}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const onDragEnter: DragEventHandler = React.useCallback(() => setDragOver(true), []);

  const onDragOver: DragEventHandler = React.useCallback(e => e.preventDefault(), []);

  const onDrop: DragEventHandler = React.useCallback(
    e => {
      setDragOver(false);
      e.preventDefault();

      const files = Array.from(e.dataTransfer.items)
        .filter(item => item.kind === 'file')
        .map(item => item.getAsFile())
        .filter(it => it != null);

      if (!files.length) {
        return;
      }

      onFilesSelected(files);
    },
    [onFilesSelected],
  );

  const onDragLeave: DragEventHandler = React.useCallback(() => setDragOver(false), []);

  return (
    <div
      className={classNames(className, styles.upload, {
        [styles.dragOver]: dragOver,
      })}
      ref={containerRef}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      data-test="ring-upload"
    >
      {children}
    </div>
  );
};

export default Upload;

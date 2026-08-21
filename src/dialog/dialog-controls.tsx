import * as React from 'react';
import closeIcon from '@jetbrains/icons/close';
import resizeIcon from '@jetbrains/icons/resize-corner-12px';

import Button from '../button/button';
import Icon from '../icon/icon';

import type {InteractionDirection, ResizeDirection} from './dialog-geometry';

import styles from './dialog.css';

const resizeDirections: ResizeDirection[] = ['n', 'ne', 'e', 's', 'sw', 'w', 'nw', 'se'];

interface DialogControlsProps {
  movable: boolean | undefined;
  resizable: boolean | undefined;
  showCloseButton: boolean;
  closeButtonTitle: string | undefined;
  onCloseClick: React.MouseEventHandler<HTMLElement>;
  onStartInteraction: (event: React.PointerEvent<HTMLElement>, direction: InteractionDirection) => void;
  onStopInteraction: React.PointerEventHandler<HTMLElement>;
}

export default function DialogControls({
  movable,
  resizable,
  showCloseButton,
  closeButtonTitle,
  onCloseClick,
  onStartInteraction,
  onStopInteraction,
}: DialogControlsProps) {
  return (
    <>
      {movable && (
        <div
          aria-hidden='true'
          className={styles.moveHandle}
          data-ring-dialog-move-handle=''
          data-test='ring-dialog-move-handle'
        />
      )}
      {showCloseButton && (
        <Button
          icon={closeIcon}
          data-test='ring-dialog-close-button'
          className={styles.closeButton}
          iconClassName={styles.closeIcon}
          onClick={onCloseClick}
          title={closeButtonTitle}
          aria-label={closeButtonTitle || 'close dialog'}
        />
      )}
      {resizable &&
        resizeDirections.map(direction => (
          <div
            aria-hidden='true'
            className={styles.resizeHandle}
            data-resize-direction={direction}
            data-test={`ring-dialog-resize-handle-${direction}`}
            key={direction}
            onPointerDown={event => onStartInteraction(event, direction)}
            onPointerUp={onStopInteraction}
            onPointerCancel={onStopInteraction}
          >
            {direction === 'se' && (
              <Icon
                aria-hidden='true'
                className={styles.resizeMarker}
                data-test='ring-dialog-resize-marker'
                glyph={resizeIcon}
              />
            )}
          </div>
        ))}
    </>
  );
}

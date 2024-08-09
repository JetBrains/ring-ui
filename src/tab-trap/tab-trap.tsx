import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect, useImperativeHandle,
  useRef
} from 'react';
import * as React from 'react';

import {isNodeInVisiblePartOfPage} from '../global/dom';

import styles from './tab-trap.css';

export const FOCUSABLE_ELEMENTS = 'input, button, select, textarea, a[href], *[tabindex]:not([data-trap-button]):not([data-scrollable-container])';

export interface TabTrapProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  trapDisabled?: boolean
  autoFocusFirst?: boolean
  focusBackOnClose?: boolean
  focusBackOnExit?: boolean
}

/**
 * @name TabTrap
 */

interface TabTrap {
  node: HTMLElement | null
}

// eslint-disable-next-line @typescript-eslint/no-shadow
const TabTrap = forwardRef<TabTrap, TabTrapProps>(function TabTrap({
  children,
  trapDisabled = false,
  autoFocusFirst = true,
  focusBackOnClose = true,
  focusBackOnExit = false,
  ...restProps
}, ref) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const trapButtonNodeRef = useRef<HTMLDivElement | null>(null);
  const previousFocusedNodeRef = useRef<Element | null>(null);
  const trapWithoutFocusRef = useRef<boolean>(false);
  const mountedRef = useRef(false);

  // It's the same approach as in focus-trap-react:
  // https://github.com/focus-trap/focus-trap-react/commit/3b22fca9eebeb883edc89548850fe5a5b9d6d50e
  // We can't do it in useEffect because it's too late, some children might have already
  // focused itself.
  if (previousFocusedNodeRef.current === null) {
    previousFocusedNodeRef.current = document.activeElement;
  }

  useImperativeHandle(ref, () => ({node: nodeRef.current}), []);

  const focusFirst = useCallback(() => focusElement(true), []);
  const focusLast = () => focusElement(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (autoFocusFirst) {
      focusFirst();
    } else if (!trapDisabled) {
      const previousFocusedElementIsInContainer =
        previousFocusedNodeRef.current &&
        nodeRef.current?.contains(previousFocusedNodeRef.current);

      // The component wrapped in TabTrap can already have a focused element (e.g. Date Picker),
      // so we need to check if it does. If so, we don't need to focus anything.
      const currentlyFocusedElementIsInContainer = nodeRef.current?.
        contains(document.activeElement);

      if (
        !nodeRef.current ||
        (!previousFocusedElementIsInContainer && !currentlyFocusedElementIsInContainer)
      ) {
        trapWithoutFocusRef.current = true;
        trapButtonNodeRef.current?.focus();
      }
    }

    return () => {
      if (focusBackOnClose) {
        restoreFocus();
      }
    };
  }, [autoFocusFirst, trapDisabled, focusBackOnClose, focusFirst]);

  function restoreFocus() {
    const previousFocusedNode = previousFocusedNodeRef.current;
    if (
      previousFocusedNode instanceof HTMLElement &&
      previousFocusedNode.focus &&
      isNodeInVisiblePartOfPage(previousFocusedNode)
    ) {
      // This is to prevent the focus from being restored the first time
      // componentWillUnmount is called in StrictMode.
      if (!mountedRef.current) {
        previousFocusedNode.focus({preventScroll: true});
      }
    }
  }

  function focusElement(first = true) {
    const node = nodeRef.current;
    if (!node) {
      return;
    }

    const tabables = [...node.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS)].
      filter(item => item.tabIndex >= 0);

    const toBeFocused = first ? tabables[0] : tabables[tabables.length - 1];

    if (toBeFocused) {
      toBeFocused.focus();
    }
  }


  function focusLastIfEnabled(event: React.FocusEvent) {
    if (trapWithoutFocusRef.current) {
      return;
    }
    if (focusBackOnExit) {
      const prevFocused = event.nativeEvent.relatedTarget;
      if (prevFocused != null && nodeRef.current != null && prevFocused instanceof Element &&
        nodeRef.current.contains(prevFocused)) {
        restoreFocus();
      }
    } else {
      focusLast();
    }
  }

  function handleBlurIfWithoutFocus(event: React.FocusEvent) {
    if (!trapWithoutFocusRef.current) {
      return;
    }
    trapWithoutFocusRef.current = false;

    const newFocused = event.nativeEvent.relatedTarget;
    if (!newFocused) {
      return;
    }

    if (newFocused instanceof Element && nodeRef.current?.contains(newFocused)) {
      return;
    }

    focusLast();
  }

  if (trapDisabled) {
    return (
      <div ref={nodeRef} {...restProps}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={nodeRef}
      {...restProps}
    >
      <div
        // It never actually stays focused
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        ref={trapButtonNodeRef}
        className={styles.trapButton}
        onFocus={focusLastIfEnabled}
        onBlur={handleBlurIfWithoutFocus}
        data-trap-button
      />
      {children}
      <div
        // It never actually stays focused
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        onFocus={focusBackOnExit ? restoreFocus : focusFirst}
        data-trap-button
      />
    </div>
  );
});

export default TabTrap;

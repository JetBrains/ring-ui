import React, {useState, useEffect, useRef, useContext, type PropsWithChildren} from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';
import {getRect} from '../global/dom';
import {toPx} from './utils';
import CollapseContext from './collapse-context';
import {COLLAPSE_CONTENT_TEST_ID, COLLAPSE_CONTENT_CONTAINER_TEST_ID} from './consts';

import styles from './collapse.css';

const DURATION_FACTOR = 0.5;
const DEFAULT_HEIGHT = 0;
const VISIBLE = 1;
const HIDDEN = 0;

interface Props {
  minHeight?: number;
  className?: string;
  'data-test'?: string | null | undefined;
}

/**
 * @name CollapseContent
 */

export const CollapseContent: React.FC<PropsWithChildren<Props>> = ({
  children,
  minHeight = DEFAULT_HEIGHT,
  'data-test': dataTest,
}) => {
  const {collapsed, duration, id, disableAnimation} = useContext(CollapseContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [initialContentHeight] = useState<number>(minHeight);
  const [contentHeight, setContentHeight] = useState<number>(DEFAULT_HEIGHT);

  const nextHeight = collapsed ? initialContentHeight : contentHeight;
  const height = toPx(nextHeight);

  const [shouldHideContent, setShouldHideContent] = useState<boolean>(collapsed && minHeight <= DEFAULT_HEIGHT);

  useEffect(() => {
    function onTransitionEnd() {
      if (initialContentHeight <= DEFAULT_HEIGHT) {
        setShouldHideContent(collapsed);
      }
    }

    const container = containerRef.current;
    container?.addEventListener('transitionend', onTransitionEnd);

    return () => {
      container?.removeEventListener('transitionend', onTransitionEnd);
    };
  }, [collapsed, initialContentHeight]);

  if (!collapsed && shouldHideContent) {
    setShouldHideContent(false);
  }

  useEffect(() => {
    if (contentRef.current) {
      const observer = new ResizeObserver(() => {
        setContentHeight(getRect(contentRef.current).height);
      });

      observer.observe(contentRef.current);
    }
  }, []);

  const calculatedDuration = duration + contentHeight * DURATION_FACTOR;
  const style = {
    '--duration': `${calculatedDuration}ms`,
    height,
    opacity: collapsed && !minHeight ? HIDDEN : VISIBLE,
  };

  const fadeShouldBeVisible = Boolean(minHeight && collapsed);

  const shouldRenderContent = disableAnimation ? !collapsed : !shouldHideContent;

  return (
    <div
      ref={containerRef}
      id={`collapse-content-${id}`}
      data-test={dataTests(COLLAPSE_CONTENT_CONTAINER_TEST_ID)}
      className={classNames(styles.container, {[styles.transition]: !disableAnimation})}
      style={style}
    >
      <div ref={contentRef} data-test={dataTests(COLLAPSE_CONTENT_TEST_ID, dataTest)}>
        {shouldRenderContent ? children : null}
      </div>
      {fadeShouldBeVisible && <div className={styles.fade} />}
    </div>
  );
};

export default CollapseContent;

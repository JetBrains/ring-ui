import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useMemo,
  useCallback,
  PropsWithChildren
} from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import {getElementHeight, toPx} from './utils';
import CollapseContext from './collapse-context';
import {COLLAPSE_CONTENT_TEST_ID, COLLAPSE_CONTENT_CONTAINER_TEST_ID} from './consts';

import styles from './collapse.css';

const DURATION_FACTOR = 0.5;
const DEFAULT_HEIGHT = 0;
const VISIBLE = 1;
const HIDDEN = 0;

type Props = {
  minHeight?: number;
  className?: string;
  'data-test'?: string | null | undefined;
  disableAnimation?: boolean;
};

/**
 * @name CollapseContent
 */

export const CollapseContent: React.FC<PropsWithChildren<Props>> = ({
  children,
  minHeight = DEFAULT_HEIGHT,
  disableAnimation = false,
  'data-test': dataTest
}) => {
  const {collapsed, duration, onChange, id} = useContext(CollapseContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const initialContentHeight = useRef<number>(minHeight);
  const contentHeight = useRef<number>(DEFAULT_HEIGHT);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0
  });
  const [height, setHeight] = useState<string>(toPx(minHeight));
  const [showFade, setShowFade] = useState<boolean>(true);

  const onTransitionStart = useCallback(() => {
    if (!collapsed) {
      setShowFade(false);
    } else {
      setShowFade(true);
    }
    onChange(collapsed);
  }, [collapsed, onChange]);

  useEffect(() => {
    const ref = containerRef.current;
    if (ref) {
      ref.addEventListener('transitionstart', onTransitionStart);
    }
    return () => {
      if (ref) {
        ref.removeEventListener('transitionstart', onTransitionStart);
      }
    };
  }, [onTransitionStart, minHeight]);

  useEffect(() => {
    if (contentRef.current) {
      contentHeight.current = getElementHeight(contentRef.current);
    }
  }, [minHeight, dimensions.height]);

  useEffect(() => {
    const nextHeight = collapsed ? initialContentHeight.current : contentHeight.current;
    setHeight(toPx(nextHeight));
  }, [collapsed, dimensions.height]);

  useEffect(() => {
    if (contentRef.current) {
      const observer = new ResizeObserver(([entry]) => {
        if (entry && entry.borderBoxSize) {
          const {inlineSize, blockSize} = entry.borderBoxSize[0];

          setDimensions({width: inlineSize, height: blockSize});
        }
      });

      observer.observe(contentRef.current);
    }
  }, []);

  const style = useMemo(() => {
    const calculatedDuration = duration + contentHeight.current * DURATION_FACTOR;
    return {
      '--duration': `${calculatedDuration}ms`,
      height,
      opacity: collapsed && !minHeight ? HIDDEN : VISIBLE
    };
  }, [duration, height, collapsed, minHeight]);

  const fadeShouldBeVisible = useMemo(() => Boolean(minHeight && showFade), [minHeight, showFade]);

  return (
    <div
      ref={containerRef}
      id={`collapse-content-${id}`}
      data-test={dataTests(COLLAPSE_CONTENT_CONTAINER_TEST_ID)}
      className={classNames(styles.container, {[styles.transition]: !disableAnimation})}
      style={style}
    >
      <div ref={contentRef} data-test={dataTests(COLLAPSE_CONTENT_TEST_ID, dataTest)}>
        {children}
      </div>
      {fadeShouldBeVisible && <div className={styles.fade}/>}
    </div>
  );
};

export default CollapseContent;

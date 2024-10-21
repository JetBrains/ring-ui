import {HTMLAttributes, useCallback, useEffect, useRef, useState} from 'react';

import classNames from 'classnames';

import styles from './scrollable-section.css';

export default function ScrollableSection({className, ...restProps}: HTMLAttributes<HTMLDivElement>) {
  const [scrolledToTop, setScrolledToTop] = useState(false);
  const [scrolledToRight, setScrolledToRight] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [scrolledToLeft, setScrolledToLeft] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const calculateScrollPosition = useCallback(() => {
    if (ref.current != null) {
      const {scrollTop, scrollLeft, scrollHeight, scrollWidth, offsetHeight, offsetWidth} = ref.current;
      setScrolledToTop(scrollTop === 0);
      setScrolledToRight(offsetWidth + scrollLeft >= scrollWidth);
      setScrolledToBottom(offsetHeight + scrollTop >= scrollHeight);
      setScrolledToLeft(scrollLeft === 0);
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(calculateScrollPosition);
    window.addEventListener('resize', calculateScrollPosition);
    return () => window.removeEventListener('resize', calculateScrollPosition);
  }, [calculateScrollPosition]);

  return (
    <div
      {...restProps}
      className={classNames(styles.scrollableSection, className, {
        [styles.withTopBorder]: !scrolledToTop,
        [styles.withRightBorder]: !scrolledToRight,
        [styles.withBottomBorder]: !scrolledToBottom,
        [styles.withLeftBorder]: !scrolledToLeft,
      })}
      ref={ref}
      onScroll={calculateScrollPosition}
    />
  );
}

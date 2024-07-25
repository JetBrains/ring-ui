import {HTMLAttributes, useCallback, useEffect, useRef, useState} from 'react';

import classNames from 'classnames';

import styles from './header.css';

// currently only supports vertical header
export default function ScrollableSection(
  {className, ...restProps}: HTMLAttributes<HTMLDivElement>
) {
  const [scrolledToTop, setScrolledToTop] = useState(true);
  const [scrolledToBottom, setScrolledToBottom] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const calculateScrollPosition = useCallback(() => {
    if (ref.current != null) {
      const {scrollTop, scrollHeight, offsetHeight} = ref.current;
      setScrolledToTop(scrollTop === 0);
      setScrolledToBottom(offsetHeight + scrollTop >= scrollHeight);
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
        [styles.withBottomBorder]: !scrolledToBottom
      })}
      ref={ref}
      onScroll={calculateScrollPosition}
    />
  );
}

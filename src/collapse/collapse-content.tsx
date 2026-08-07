import React, {useState, useEffect, useRef, use, type PropsWithChildren} from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';
import {getRect} from '../global/dom';
import {parseCssDuration} from '../global/parse-css-duration';
import {toPx} from './utils';
import CollapseContext from './collapse-context';
import {COLLAPSE_CONTENT_TEST_ID, COLLAPSE_CONTENT_CONTAINER_TEST_ID} from './consts';

import styles from './collapse.css';

const DURATION_FACTOR = 0.5;
const DEFAULT_HEIGHT = 0;
const VISIBLE = 1;
const HIDDEN = 0;
// margin for the hide fallback timer, so it fires only if transitionend never did
const HIDE_FALLBACK_EXTRA_DELAY = 100;

const isFullyCollapsed = (collapsed: boolean, initialContentHeight: number) =>
  collapsed && initialContentHeight <= DEFAULT_HEIGHT;

interface Props {
  /**
   * Height of the always-visible preview of the collapsed content.
   * The collapsed subtree is inert until expanded, matching `aria-expanded`.
   * The preview is only a visual clip of that subtree, so it is inert too and
   * assistive technology will not perceive it — if the preview carries essential
   * information, expose an accessible summary outside the collapsed content.
   */
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
  const {collapsed, duration, id, disableAnimation, keepMounted} = use(CollapseContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [initialContentHeight] = useState<number>(minHeight);
  const [contentHeight, setContentHeight] = useState<number>(DEFAULT_HEIGHT);

  const nextHeight = collapsed ? initialContentHeight : contentHeight;
  const height = toPx(nextHeight);

  const [shouldHideContent, setShouldHideContent] = useState<boolean>(collapsed && minHeight <= DEFAULT_HEIGHT);

  useEffect(() => {
    const container = containerRef.current;

    function finalizeCollapse() {
      if (initialContentHeight <= DEFAULT_HEIGHT) {
        setShouldHideContent(collapsed);
      }
    }

    function onTransitionEnd(event: TransitionEvent) {
      // transitionend bubbles: only the container's own height transition finalizes the collapse
      if (event.target === container && event.propertyName === 'height') {
        finalizeCollapse();
      }
    }

    container?.addEventListener('transitionend', onTransitionEnd);
    // fallback for suppressed or cancelled transitions (e.g. `transition: none` overrides),
    // which emit no transitionend and would otherwise leave the content interactive forever.
    // Armed once per collapse toggle from the --duration committed to the DOM — the value
    // the running transition actually uses — so it can neither undercut a transition started
    // from a stale height nor be restarted by content resizes or duration changes mid-collapse
    const cssDuration = parseCssDuration(container?.style.getPropertyValue('--duration') || '');
    const fallbackTimeout = window.setTimeout(finalizeCollapse, cssDuration + HIDE_FALLBACK_EXTRA_DELAY);

    return () => {
      container?.removeEventListener('transitionend', onTransitionEnd);
      window.clearTimeout(fallbackTimeout);
    };
  }, [collapsed, initialContentHeight]);

  // render-phase state adjustments (not effects): the React Compiler lint forbids
  // setState-in-effect, and https://react.dev/learn/you-might-not-need-an-effect
  // documents this pattern for resetting state when props change
  if (!collapsed && shouldHideContent) {
    setShouldHideContent(false);
  }

  // without a transition there is no transitionend to wait for, so hide immediately
  if (disableAnimation && !shouldHideContent && isFullyCollapsed(collapsed, initialContentHeight)) {
    setShouldHideContent(true);
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

  const contentVisible = !shouldHideContent;
  const contentHidden = Boolean(keepMounted) && !contentVisible;
  // interaction is blocked as soon as the panel collapses (matching aria-expanded), while
  // visibility waits for the animation to finish so the content stays painted meanwhile.
  // This includes a minHeight preview: content clipped below it must not take focus,
  // and inert cannot be applied any more granularly than to the whole subtree
  const contentInert = collapsed;

  return (
    <div
      ref={containerRef}
      id={`collapse-content-${id}`}
      data-test={dataTests(COLLAPSE_CONTENT_CONTAINER_TEST_ID)}
      className={classNames(styles.container, {[styles.transition]: !disableAnimation})}
      style={style}
    >
      <div
        ref={contentRef}
        data-test={dataTests(COLLAPSE_CONTENT_TEST_ID, dataTest)}
        // visibility: hidden removes the fully collapsed content from the tab order and accessibility
        // tree, but descendants can override it with visibility: visible — inert cannot be escaped.
        // Both are rendered in JSX so server-rendered collapsed markup is protected before hydration.
        style={contentHidden ? {visibility: 'hidden'} : undefined}
        inert={contentInert}
      >
        {keepMounted || contentVisible ? children : null}
      </div>
      {fadeShouldBeVisible && <div className={styles.fade} />}
    </div>
  );
};

export default CollapseContent;

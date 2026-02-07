import {useEffect, useId, useMemo, useRef, useState} from 'react';

import {getRect} from '../global/dom';

const BASE_ANIMATION_DURATION = 200;
const ANIMATION_HEIGHT_FACTOR = 0.5;
const DEFAULT_HEIGHT = 0;
const VISIBLE = 1;
const HIDDEN = 0;

interface ExpandHookOptions {
  defaultExpanded: boolean;
  expanded?: boolean | null;
  onChange: (expanded: boolean) => void;
  interactive: boolean;
}

const useExpandAnimation = (collapsed: boolean) => {
  const bodyContainerRef = useRef<HTMLDivElement>(null);
  const bodyContentRef = useRef<HTMLDivElement | null>(null);
  const [bodyHeight, setBodyHeight] = useState<number>(DEFAULT_HEIGHT);
  const [shouldHideContent, setShouldHideContent] = useState<boolean>(collapsed);

  useEffect(() => {
    const container = bodyContainerRef.current;
    if (!container) {
      return undefined;
    }

    const onTransitionEnd = () => {
      setShouldHideContent(collapsed);
    };

    container.addEventListener('transitionend', onTransitionEnd);

    return () => {
      container.removeEventListener('transitionend', onTransitionEnd);
    };
  }, [collapsed]);

  if (!collapsed && shouldHideContent) {
    setShouldHideContent(false);
  }

  useEffect(() => {
    if (!bodyContentRef.current) {
      return;
    }

    const onResize = () => {
      if (bodyContentRef.current) {
        setBodyHeight(getRect(bodyContentRef.current).height);
      }
    };

    const observer = new ResizeObserver(onResize);

    observer.observe(bodyContentRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const calculatedDuration = BASE_ANIMATION_DURATION + bodyHeight * ANIMATION_HEIGHT_FACTOR;
  const bodyStyle = {
    '--duration': `${calculatedDuration}ms`,
    height: `${collapsed ? DEFAULT_HEIGHT : bodyHeight}px`,
    opacity: collapsed ? HIDDEN : VISIBLE,
  } as React.CSSProperties;

  return {
    bodyContainerRef,
    bodyContentRef,
    bodyStyle,
    shouldRenderBody: !shouldHideContent,
  };
};

export const useExpandBehavior = ({defaultExpanded, expanded, onChange, interactive}: ExpandHookOptions) => {
  const [innerExpanded, setInnerExpanded] = useState(defaultExpanded);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const bodyId = useId();
  const titleId = useId();

  const isExpanded = useMemo(() => expanded ?? innerExpanded, [expanded, innerExpanded]);
  const collapsed = !isExpanded;
  const {bodyContainerRef, bodyContentRef, bodyStyle, shouldRenderBody} = useExpandAnimation(collapsed);

  const setExpandedState = (nextExpanded: boolean) => {
    if (expanded == null) {
      setInnerExpanded(nextExpanded);
    }
    onChange(nextExpanded);
  };

  const toggleExpanded = () => {
    setExpandedState(!isExpanded);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpanded();
    }
  };

  const onBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }
    setFocused(false);
  };

  let headerProps: React.HTMLAttributes<HTMLDivElement> = {};
  if (interactive) {
    headerProps = {
      role: 'button',
      tabIndex: 0,
      onClick: toggleExpanded,
      onKeyDown,
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocus: () => setFocused(true),
      onBlur,
    };
  }

  return {
    bodyContainerRef,
    bodyContentRef,
    bodyId,
    titleId,
    bodyStyle,
    shouldRenderBody,
    headerProps,
    isExpanded,
    hovered,
    focused,
  };
};

import {type RefObject, useEffect, useState} from 'react';

export function useIntersectionObserver(containerRef: RefObject<HTMLElement | null>, scrollMargin: number = 0) {
  const [handle, setHandle] = useState<IntersectionObserverHandle | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elementToSetVisible = new Map<Element, (isVisible: boolean) => void>();

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const setVisible = elementToSetVisible.get(entry.target);
          setVisible?.(entry.isIntersecting);
        }
      },
      {
        root: container,
        ...(scrollMargin
          ? {
              scrollMargin: `${scrollMargin}px`,
            }
          : {}),
      },
    );

    setHandle({
      observeVisibility(element, setVisible) {
        elementToSetVisible.set(element, setVisible);
        observer.observe(element);

        return () => {
          elementToSetVisible.delete(element);
          observer.unobserve(element);
        };
      },
    });

    return () => {
      observer.disconnect();
      setHandle(null);
    };
  }, [containerRef, scrollMargin]);

  return handle;
}

export interface IntersectionObserverHandle {
  observeVisibility(element: Element, setVisible: (isVisible: boolean) => void): () => void;
}

export function useVisibility(handle: IntersectionObserverHandle | null, elementRef: RefObject<Element | null>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !handle) return;

    return handle.observeVisibility(element, setIsVisible);
  }, [handle, elementRef, setIsVisible]);

  return isVisible;
}

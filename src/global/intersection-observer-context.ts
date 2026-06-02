import {createContext, type RefObject, useContext, useEffect, useState} from 'react';

/**
 * Usage:
 *
 * ```tsx
 * <IntersectionObserverContext.Provider value={useIntersectionObserverHandle()}>
 *   <YourComponent />
 * </IntersectionObserverContext.Provider>
 *
 * function YourComponent() {
 *   // Contains the current isIntersecting value
 *   const isIntersecting = useIsIntersecting(elementRef);
 *   // Or, to get updates instead:
 *   useIsIntersectingListener(elementRef, newIsIntersecting => {
 *     // ...
 *   })
 * }
 * ```
 */
export const IntersectionObserverContext = createContext<IntersectionObserverHandle | null>(null);

export function useIntersectionObserverHandle(
  rootRef?: RefObject<HTMLElement | null>,
  rootMargin?: number,
  scrollMargin?: number,
) {
  const [handle, setHandle] = useState<IntersectionObserverHandle | null>(null);

  useEffect(() => {
    const root = rootRef?.current;

    const elementToOnChange = new Map<Element, (isIntersecting: boolean) => void>();

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const onChange = elementToOnChange.get(entry.target);
          onChange?.(entry.isIntersecting);
        }
      },
      {
        root,
        rootMargin: rootMargin != null ? `${rootMargin}px` : undefined,
        scrollMargin: scrollMargin != null ? `${scrollMargin}px` : undefined,
      },
    );

    setHandle({
      observe(element, onChange) {
        elementToOnChange.set(element, onChange);
        observer.observe(element);

        return () => {
          elementToOnChange.delete(element);
          observer.unobserve(element);
        };
      },
    });

    return () => {
      observer.disconnect();
      setHandle(null);
    };
  }, [rootRef, rootMargin, scrollMargin]);

  return handle;
}

export interface IntersectionObserverHandle {
  observe(element: Element, setIsIntersecting: (isIntersecting: boolean) => void): () => void;
}

export function useIsIntersecting(elementRef: RefObject<Element | null>) {
  const handle = useContext(IntersectionObserverContext);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !handle) return;

    return handle.observe(element, setIsIntersecting);
  }, [handle, elementRef, setIsIntersecting]);

  return isIntersecting;
}

export function useIsIntersectingListener(
  elementRef: RefObject<Element | null>,
  onChange: (isIntersecting: boolean) => void,
) {
  const handle = useContext(IntersectionObserverContext);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !handle) return;

    return handle.observe(element, onChange);
  }, [handle, elementRef, onChange]);
}

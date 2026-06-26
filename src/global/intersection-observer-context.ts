import {createContext, type RefObject, use, useEffect, useState} from 'react';

/**
 * Provides access to a shared `IntersectionObserver` instance
 * via the {@link IntersectionObserverContext} context.
 *
 * @see IntersectionObserverContext
 */
export interface IntersectionObserverHandle {
  /**
   * Starts observing an element.
   *
   * Returns a cleanup function that stops observing it.
   */
  observe(element: Element, isIntersecting: (isIntersecting: boolean) => void): () => void;
}

/**
 * @internal
 */
const noopIntersectionObserverHandle: IntersectionObserverHandle = {
  observe: () => () => {},
};

/**
 * Multiple components can share a single `IntersectionObserver` instance through this context.
 *
 * Usage:
 *
 * ```tsx
 * <IntersectionObserverContext value={useIntersectionObserverHandle()}>
 *   <YourComponent />
 * </IntersectionObserverContext>
 *
 * function YourComponent() {
 *   // Contains the current isIntersecting value
 *   const isIntersecting = useIsIntersecting(elementRef);
 *
 *   // Or, to manually work with the IntersectionObserverHandle:
 *   const handle = use(IntersectionObserverContext);
 *   useEffect(() => {
 *     return handle.observe(elementRef.current, isIntersecting => { ... })
 *   })
 * }
 * ```
 */
export const IntersectionObserverContext = createContext<IntersectionObserverHandle>(noopIntersectionObserverHandle);

/**
 * Creates an IntersectionObserverHandle suitable for {@link IntersectionObserverContext}.
 */
export function useIntersectionObserverHandle(
  rootRef?: RefObject<HTMLElement | null>,
  rootMargin?: number,
  scrollMargin?: number,
) {
  const [handle, setHandle] = useState(noopIntersectionObserverHandle);

  useEffect(() => {
    const root = rootRef?.current;

    const callbacksByElement = new Map<Element, ((isIntersecting: boolean) => void)[]>();

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const callbacks = callbacksByElement.get(entry.target);
          callbacks?.forEach(cb => cb(entry.isIntersecting));
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
        if (!callbacksByElement.has(element)) {
          callbacksByElement.set(element, []);
          observer.observe(element);
        }
        callbacksByElement.get(element)!.push(onChange);

        return () => {
          const callbacks = callbacksByElement.get(element);
          if (!callbacks) return;

          const index = callbacks.indexOf(onChange);
          if (index !== -1) {
            callbacks.splice(index, 1);
          }
          if (!callbacks.length) {
            callbacksByElement.delete(element);
            observer.unobserve(element);
          }
        };
      },
    });

    return () => {
      observer.disconnect();
      setHandle(noopIntersectionObserverHandle);
    };
  }, [rootRef, rootMargin, scrollMargin]);

  return handle;
}

/**
 * Returns whether the referenced element is currently intersecting.
 */
export function useIsIntersecting(elementRef: RefObject<Element | null>) {
  const handle = use(IntersectionObserverContext);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    return handle.observe(element, setIsIntersecting);
  }, [handle, elementRef]);

  return isIntersecting;
}

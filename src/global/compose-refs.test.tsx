import {createRef, StrictMode} from 'react';
import {render} from '@testing-library/react';

import {createComposedRef} from './compose-refs';

describe('createComposedRef', () => {
  it('should assign and clear refs without cleanup functions', () => {
    const callbackRef = vi.fn();
    const objectRef = createRef<HTMLDivElement>();
    const ref = createComposedRef<HTMLDivElement>()(callbackRef, objectRef, null, undefined);
    const element = document.createElement('div');

    expect(ref(element)).to.be.undefined;
    expect(callbackRef).toHaveBeenCalledExactlyOnceWith(element);
    expect(objectRef.current).to.equal(element);

    expect(ref(null)).to.be.undefined;
    expect(callbackRef).toHaveBeenLastCalledWith(null);
    expect(objectRef.current).to.be.null;
  });

  it('should clean up mixed refs on unmount', () => {
    const cleanup = vi.fn();
    const cleanupRef = vi.fn(() => cleanup);
    const callbackRef = vi.fn();
    const objectRef = createRef<HTMLDivElement>();
    const ref = createComposedRef<HTMLDivElement>()(cleanupRef, callbackRef, objectRef, null, undefined);
    const {container, unmount} = render(<div ref={ref} />);
    const element = container.firstChild;

    expect(cleanupRef).toHaveBeenCalledExactlyOnceWith(element);
    expect(callbackRef).toHaveBeenCalledExactlyOnceWith(element);
    expect(objectRef.current).to.equal(element);
    expect(cleanup).not.toHaveBeenCalled();

    unmount();

    expect(cleanup).toHaveBeenCalledExactlyOnceWith();
    expect(cleanupRef).toHaveBeenCalledExactlyOnceWith(element);
    expect(callbackRef).toHaveBeenLastCalledWith(null);
    expect(objectRef.current).to.be.null;
  });

  it('should call every cleanup function', () => {
    const firstCleanup = vi.fn();
    const secondCleanup = vi.fn();
    const ref = createComposedRef<HTMLDivElement>()(
      () => firstCleanup,
      () => secondCleanup,
    );
    const {unmount} = render(<div ref={ref} />);

    unmount();

    expect(firstCleanup).toHaveBeenCalledExactlyOnceWith();
    expect(secondCleanup).toHaveBeenCalledExactlyOnceWith();
  });

  it('should clean up the previous refs when the composed ref changes', () => {
    const cleanup = vi.fn();
    const previousRef = vi.fn(() => cleanup);
    const nextRef = vi.fn();
    const objectRef = createRef<HTMLDivElement>();
    const composeRefs = createComposedRef<HTMLDivElement>();
    const {container, rerender, unmount} = render(<div ref={composeRefs(previousRef, objectRef)} />);
    const element = container.firstChild;

    rerender(<div ref={composeRefs(nextRef, objectRef)} />);

    expect(cleanup).toHaveBeenCalledExactlyOnceWith();
    expect(previousRef).toHaveBeenCalledExactlyOnceWith(element);
    expect(nextRef).toHaveBeenCalledExactlyOnceWith(element);
    expect(objectRef.current).to.equal(element);

    unmount();

    expect(nextRef).toHaveBeenLastCalledWith(null);
    expect(objectRef.current).to.be.null;
  });

  it('should support repeated setup and cleanup in StrictMode', () => {
    const cleanup = vi.fn();
    const cleanupRef = vi.fn(() => cleanup);
    const objectRef = createRef<HTMLDivElement>();
    const ref = createComposedRef<HTMLDivElement>()(cleanupRef, objectRef);
    const {container, unmount} = render(
      <StrictMode>
        <div ref={ref} />
      </StrictMode>,
    );
    const element = container.firstChild;

    expect(cleanupRef).toHaveBeenCalledTimes(2);
    expect(cleanupRef).toHaveBeenLastCalledWith(element);
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(objectRef.current).to.equal(element);

    unmount();

    expect(cleanupRef).toHaveBeenCalledTimes(2);
    expect(cleanup).toHaveBeenCalledTimes(2);
    expect(objectRef.current).to.be.null;
  });

  it('should reuse the composed ref when refs have not changed', () => {
    const composeRefs = createComposedRef<HTMLDivElement>();
    const ref = createRef<HTMLDivElement>();

    expect(composeRefs(ref)).to.equal(composeRefs(ref));
  });
});

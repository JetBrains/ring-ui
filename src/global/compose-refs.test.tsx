import {useMemo, useRef} from 'react';
import {render, screen} from '@testing-library/react';

import {useComposedRef} from './compose-refs';

describe('compose-refs', () => {
  it('should install simple refs', () => {
    let getCurrent1: () => HTMLDivElement | null;
    let getCurrent2: () => HTMLDivElement | null;

    function TestComponent() {
      const ref1 = useRef<HTMLDivElement>(null);
      const ref2 = useRef<HTMLDivElement>(null);

      getCurrent1 = () => ref1.current;
      getCurrent2 = () => ref2.current;

      const composedRef = useComposedRef(ref1, ref2);
      return <div ref={composedRef} data-test='test-div' />;
    }

    render(<TestComponent />);
    const div = screen.getByTestId('test-div');
    expect(div).to.exist;
    expect(getCurrent1!()).to.equal(div);
    expect(getCurrent2!()).to.equal(div);
  });

  it('should install function refs', () => {
    let getCurrent1: () => HTMLDivElement | null;
    let getCurrent2: () => HTMLDivElement | null;
    let getCleanup2: () => boolean;

    function TestComponent({noRender}: {noRender?: boolean}) {
      const ref1 = useRef<HTMLDivElement>(null);
      const ref1Function = useMemo(
        () => (value: HTMLDivElement | null) => {
          ref1.current = value;
        },
        [],
      );

      const ref2 = useRef<HTMLDivElement>(null);
      const ref2Cleanup = useRef(false);
      const ref2Function = useMemo(
        () => (value: HTMLDivElement | null) => {
          ref2.current = value;
          return () => {
            ref2Cleanup.current = true;
          };
        },
        [],
      );

      getCurrent1 = () => ref1.current;
      getCurrent2 = () => ref2.current;
      getCleanup2 = () => ref2Cleanup.current;

      const composedRef = useComposedRef(ref1Function, ref2Function);
      if (noRender) return null;

      return <div ref={composedRef} data-test='test-div' />;
    }

    const {rerender} = render(<TestComponent />);
    const div = screen.getByTestId('test-div');
    expect(div).to.exist;
    expect(getCurrent1!()).to.equal(div);
    expect(getCurrent2!()).to.equal(div);
    expect(getCleanup2!()).to.equal(false);

    rerender(<TestComponent noRender />);
    rerender(<TestComponent />);
    const newDiv = screen.getByTestId('test-div');
    expect(newDiv).to.exist;
    expect(newDiv).to.not.equal(div);
    expect(getCurrent1!()).to.equal(newDiv);
    expect(getCurrent2!()).to.equal(newDiv);
    expect(getCleanup2!()).to.equal(true);
  });

  it('should be stable', () => {
    let currentComposedRef: ReturnType<typeof useComposedRef> | null = null;

    function TestComponent({dataVal}: {dataVal?: string}) {
      const ref1 = useRef<HTMLDivElement>(null);
      const ref2 = useRef<HTMLDivElement>(null);

      const composedRef = useComposedRef(ref1, ref2);
      currentComposedRef = composedRef;
      return <div ref={composedRef} data-test='test-div' data-val={dataVal} />;
    }

    const {rerender} = render(<TestComponent />);
    expect(screen.getByTestId('test-div')).to.exist;
    const firstRenderComposedRef = currentComposedRef;
    expect(firstRenderComposedRef).to.exist;

    rerender(<TestComponent dataVal='new-val' />);
    expect(screen.getByTestId('test-div')).to.exist;
    const secondRenderComposedRef = currentComposedRef;
    expect(secondRenderComposedRef).to.exist;
    expect(firstRenderComposedRef).to.equal(secondRenderComposedRef);
  });
});

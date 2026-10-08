import {createEvent, fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {type ComponentProps} from 'react';

import {Slider} from './slider';

const DEFAULT_VALUE = 42;

describe('Slider', () => {
  beforeEach(() => {
    // jsdom does not implement PointerEvent or pointer capture.
    vi.stubGlobal(
      'PointerEvent',
      class extends MouseEvent {
        pointerId: number;
        pointerType: string;
        isPrimary: boolean;

        constructor(type: string, options: PointerEventInit = {}) {
          super(type, options);
          this.pointerId = options.pointerId ?? 1;
          this.pointerType = options.pointerType ?? 'mouse';
          this.isPrimary = options.isPrimary ?? true;
        }
      },
    );
  });

  const renderSlider = (props?: ComponentProps<typeof Slider>) => {
    const result = render(<Slider {...props} />);
    const slider = result.container.firstElementChild as HTMLDivElement;
    let capturedPointer: number | null = null;
    const setPointerCapture = vi.fn((pointerId: number) => {
      capturedPointer = pointerId;
    });
    const releasePointerCapture = vi.fn(() => {
      capturedPointer = null;
    });
    Object.assign(slider, {
      setPointerCapture,
      hasPointerCapture: (pointerId: number) => capturedPointer === pointerId,
      releasePointerCapture,
    });
    vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({left: 0, width: 100} as DOMRect);
    return {...result, slider, setPointerCapture, releasePointerCapture};
  };
  const pressKey = (key: string) => {
    // Combokeys reads which, which userEvent.keyboard does not populate.
    const keyCodes: Record<string, number> = {
      ArrowLeft: 37,
      ArrowDown: 40,
      ArrowRight: 39,
      ArrowUp: 38,
      Home: 36,
      End: 35,
    };
    const keyDown = createEvent.keyDown(document.activeElement!, {key, keyCode: keyCodes[key], which: keyCodes[key]});
    fireEvent(document.activeElement!, keyDown);
    fireEvent.keyUp(document.activeElement!, {key, keyCode: keyCodes[key], which: keyCodes[key]});
    return keyDown.defaultPrevented;
  };

  it('should create component', () => {
    const {container} = renderSlider();
    expect(container.firstElementChild).to.exist;
  });

  it('should use passed className', () => {
    const {container} = renderSlider({className: 'test-class'});
    expect(container.querySelector('.test-class')).to.exist;
  });

  it('should use min value when defaultValue or value are unspecified', () => {
    renderSlider({min: DEFAULT_VALUE, showTag: true});
    expect(screen.getByText(DEFAULT_VALUE)).to.exist;
    expect(screen.getByRole('tooltip')).to.exist;
  });

  it('should use values in range', () => {
    const RIGHT = 101;
    renderSlider({defaultValue: [-1, RIGHT], showTag: true});
    const tooltips = screen.getAllByRole('tooltip');
    expect(tooltips[0]?.textContent).to.equal('0');
    expect(tooltips[1]?.textContent).to.equal('100');
  });

  it('should display a formatted tag', () => {
    renderSlider({
      defaultValue: DEFAULT_VALUE,
      showTag: true,
      renderTag: value => `%${value}%`,
    });
    expect(screen.getByRole('tooltip').textContent).to.equal(`%${DEFAULT_VALUE}%`);
  });

  it.each([
    ['ArrowLeft', 41],
    ['ArrowDown', 41],
    ['ArrowRight', 43],
    ['ArrowUp', 43],
    ['Home', 0],
    ['End', 100],
  ])('should handle %s only while focused', async (key, expectedValue) => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <>
        <button type='button'>{'Outside'}</button>
        <Slider defaultValue={DEFAULT_VALUE} onChange={onChange} />
      </>,
    );

    await user.tab();
    expect(pressKey(key)).to.be.false;
    expect(onChange).not.toHaveBeenCalled();

    await user.tab();
    expect(pressKey(key)).to.be.true;
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expectedValue);

    await user.tab({shift: true});
    expect(pressKey(key)).to.be.false;
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['ArrowLeft', 0],
    ['ArrowDown', 0],
    ['Home', 0],
    ['ArrowRight', 100],
    ['ArrowUp', 100],
    ['End', 100],
  ])('should prevent the default action of %s at the range boundary', async (key, value) => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSlider({defaultValue: value, onChange});

    await user.tab();
    expect(pressKey(key)).to.be.true;
    expect(onChange).toHaveBeenCalledExactlyOnceWith(value);
  });

  it('should keep shortcuts active when focus moves between range thumbs', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderSlider({defaultValue: [20, 40], onChange});

    await user.tab();
    pressKey('Home');
    expect(onChange).toHaveBeenLastCalledWith([0, 40]);

    await user.tab();
    pressKey('End');
    expect(onChange).toHaveBeenLastCalledWith([0, 100]);

    await user.tab({shift: true});
    pressKey('ArrowRight');
    expect(onChange).toHaveBeenLastCalledWith([1, 100]);
  });

  it('should handle shortcuts only in the focused slider', async () => {
    const user = userEvent.setup();
    const firstOnChange = vi.fn();
    const secondOnChange = vi.fn();
    render(
      <>
        <Slider defaultValue={DEFAULT_VALUE} onChange={firstOnChange} />
        <Slider defaultValue={DEFAULT_VALUE} onChange={secondOnChange} />
      </>,
    );

    await user.tab();
    pressKey('End');
    expect(firstOnChange).toHaveBeenCalledExactlyOnceWith(100);
    expect(secondOnChange).not.toHaveBeenCalled();

    await user.tab();
    pressKey('Home');
    expect(firstOnChange).toHaveBeenCalledTimes(1);
    expect(secondOnChange).toHaveBeenCalledExactlyOnceWith(0);
  });

  it('should disable shortcuts when a focused slider becomes disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const {rerender} = renderSlider({defaultValue: DEFAULT_VALUE, onChange});

    await user.tab();
    rerender(<Slider defaultValue={DEFAULT_VALUE} onChange={onChange} disabled />);
    expect(pressKey('End')).to.be.false;
    expect(onChange).not.toHaveBeenCalled();

    rerender(<Slider defaultValue={DEFAULT_VALUE} onChange={onChange} />);
    pressKey('End');
    expect(onChange).toHaveBeenCalledExactlyOnceWith(100);
  });

  it('should handle only 2 values in range', () => {
    const NEW_VALUE = 5;
    const onChange = vi.fn();
    const {container} = renderSlider({
      defaultValue: [1, 2, 1, 0],
      onChange,
    });

    const slider = container.firstElementChild!;
    fireEvent.pointerDown(slider, {clientX: NEW_VALUE});
    fireEvent.pointerUp(slider, {clientX: NEW_VALUE});

    expect(onChange).toHaveBeenCalledWith([1, NEW_VALUE]);
  });

  it('should swap values when one is moved over another', () => {
    const LEFT = 20;
    const RIGHT = 40;
    const NEW_VALUE = 5;
    const onChange = vi.fn();

    const {slider} = renderSlider({defaultValue: [LEFT, RIGHT], onChange});
    const thumbs = screen.getAllByRole('slider');

    fireEvent.pointerDown(thumbs[1], {clientX: RIGHT});
    fireEvent.pointerMove(slider, {clientX: NEW_VALUE});
    expect(onChange).toHaveBeenLastCalledWith([NEW_VALUE, LEFT]);
    fireEvent.pointerMove(slider, {clientX: NEW_VALUE + 1});
    fireEvent.pointerUp(slider, {clientX: NEW_VALUE + 1});

    expect(onChange).toHaveBeenLastCalledWith([NEW_VALUE + 1, LEFT]);
  });

  it('should set min value when clicking the leftmost point with marks', () => {
    const onChange = vi.fn();
    const {container} = renderSlider({defaultValue: 50, step: 25, marks: true, onChange});
    const slider = container.firstElementChild!;
    vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({left: 0, width: 100} as DOMRect);

    fireEvent.pointerDown(slider, {clientX: 0});
    fireEvent.pointerUp(slider, {clientX: 0});

    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it.each(['mouse', 'touch', 'pen'])('should drag with a %s pointer and clamp values outside the rail', pointerType => {
    const onChange = vi.fn();
    const {slider, setPointerCapture, releasePointerCapture} = renderSlider({defaultValue: DEFAULT_VALUE, onChange});
    const pointer = {pointerId: 7, pointerType};

    fireEvent.pointerDown(screen.getByRole('slider'), {...pointer, clientX: DEFAULT_VALUE});
    expect(setPointerCapture).toHaveBeenCalledWith(pointer.pointerId);

    fireEvent.pointerMove(slider, {...pointer, clientX: 75});
    expect(onChange).toHaveBeenLastCalledWith(75);
    fireEvent.pointerMove(slider, {...pointer, clientX: 120});
    expect(onChange).toHaveBeenLastCalledWith(100);
    fireEvent.pointerUp(slider, {...pointer, clientX: -20});
    expect(onChange).toHaveBeenLastCalledWith(0);
    expect(releasePointerCapture).toHaveBeenCalledWith(pointer.pointerId);

    onChange.mockClear();
    fireEvent.pointerMove(slider, {...pointer, clientX: 50});
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should ignore other pointers during a drag', () => {
    const onChange = vi.fn();
    const {slider, setPointerCapture} = renderSlider({defaultValue: DEFAULT_VALUE, onChange});
    fireEvent.pointerDown(screen.getByRole('slider'), {pointerId: 1});
    fireEvent.pointerDown(slider, {pointerId: 2, clientX: 80});
    fireEvent.pointerMove(slider, {pointerId: 2, clientX: 80});
    fireEvent.pointerUp(slider, {pointerId: 2, clientX: 80});
    fireEvent.pointerCancel(slider, {pointerId: 2});
    expect(setPointerCapture).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.pointerMove(slider, {pointerId: 1, clientX: 60});
    expect(onChange).toHaveBeenLastCalledWith(60);
  });

  it.each(['pointerCancel', 'lostPointerCapture'] as const)('should stop dragging after %s', event => {
    const onChange = vi.fn();
    const {slider} = renderSlider({defaultValue: DEFAULT_VALUE, onChange});
    const thumb = screen.getByRole('slider');
    fireEvent.pointerDown(thumb, {pointerId: 1});
    fireEvent.pointerMove(slider, {pointerId: 1, clientX: 60});
    onChange.mockClear();

    fireEvent[event](slider, {pointerId: 1});
    fireEvent.pointerMove(slider, {pointerId: 1, clientX: 70});
    fireEvent.pointerUp(slider, {pointerId: 1, clientX: 70});
    expect(onChange).not.toHaveBeenCalled();
    expect(thumb).not.to.have.class('dragged');

    fireEvent.pointerDown(thumb, {pointerId: 2});
    fireEvent.pointerUp(slider, {pointerId: 2, clientX: 80});
    expect(onChange).toHaveBeenLastCalledWith(80);
  });

  it('should ignore right clicks and non-primary pointers', () => {
    const onChange = vi.fn();
    const {slider, setPointerCapture} = renderSlider({onChange});
    fireEvent.pointerDown(slider, {button: 2});
    fireEvent.pointerMove(slider, {clientX: 50});
    fireEvent.pointerUp(slider, {clientX: 50});
    fireEvent.pointerDown(slider, {isPrimary: false, pointerType: 'touch'});
    fireEvent.pointerUp(slider, {clientX: 50});
    expect(setPointerCapture).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should cancel dragging when disabled and allow another drag after enabling', () => {
    const onChange = vi.fn();
    const {slider, rerender, releasePointerCapture} = renderSlider({defaultValue: DEFAULT_VALUE, onChange});
    fireEvent.pointerDown(screen.getByRole('slider'), {pointerId: 1});
    rerender(<Slider defaultValue={DEFAULT_VALUE} onChange={onChange} disabled />);
    expect(releasePointerCapture).toHaveBeenCalledWith(1);
    fireEvent.pointerMove(slider, {pointerId: 1, clientX: 50});
    fireEvent.pointerUp(slider, {pointerId: 1, clientX: 50});
    fireEvent.pointerDown(slider, {pointerId: 2});
    fireEvent.pointerUp(slider, {pointerId: 2, clientX: 80});
    expect(onChange).not.toHaveBeenCalled();

    rerender(<Slider defaultValue={DEFAULT_VALUE} onChange={onChange} />);
    fireEvent.pointerDown(screen.getByRole('slider'), {pointerId: 3});
    fireEvent.pointerUp(slider, {pointerId: 3, clientX: 80});
    expect(onChange).toHaveBeenLastCalledWith(80);
  });
});

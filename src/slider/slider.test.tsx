import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {type ComponentProps} from 'react';

import {Slider} from './slider';

const DEFAULT_VALUE = 42;

describe('Slider', () => {
  const renderSlider = (props?: ComponentProps<typeof Slider>) => render(<Slider {...props} />);
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
    fireEvent.keyDown(document.activeElement!, {key, keyCode: keyCodes[key], which: keyCodes[key]});
    fireEvent.keyUp(document.activeElement!, {key, keyCode: keyCodes[key], which: keyCodes[key]});
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
    pressKey(key);
    expect(onChange).not.toHaveBeenCalled();

    await user.tab();
    pressKey(key);
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expectedValue);

    await user.tab({shift: true});
    pressKey(key);
    expect(onChange).toHaveBeenCalledTimes(1);
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
    pressKey('End');
    expect(onChange).not.toHaveBeenCalled();

    rerender(<Slider defaultValue={DEFAULT_VALUE} onChange={onChange} />);
    pressKey('End');
    expect(onChange).toHaveBeenCalledExactlyOnceWith(100);
  });

  it.skip('should handle only 2 values in range', () => {
    const NEW_VALUE = 5;
    const onChange = vi.fn();
    const {container} = renderSlider({
      defaultValue: [1, 2, 1, 0],
      onChange,
    });

    const slider = container.firstElementChild!;
    fireEvent.mouseDown(slider, {clientX: 50});
    fireEvent.mouseUp(slider, {clientX: 50});

    expect(onChange).toHaveBeenCalledWith([1, NEW_VALUE]);
  });

  it.skip('should swap values when one is moved over another', () => {
    const LEFT = 20;
    const RIGHT = 40;
    const NEW_VALUE = 5;
    const onChange = vi.fn();

    renderSlider({defaultValue: [LEFT, RIGHT], onChange});
    const thumbs = screen.getAllByRole('slider');

    fireEvent.mouseDown(thumbs[1]); // Second thumb
    fireEvent.mouseUp(document.body, {clientX: 50});

    expect(onChange).toHaveBeenCalledWith([NEW_VALUE, LEFT]);
  });

  it('should set min value when clicking the leftmost point with marks', () => {
    const onChange = vi.fn();
    const {container} = renderSlider({defaultValue: 50, step: 25, marks: true, onChange});
    const slider = container.firstElementChild!;
    vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({left: 0, width: 100} as DOMRect);

    fireEvent.mouseDown(slider, {pageX: 0});
    fireEvent.mouseUp(window, {pageX: 0});

    expect(onChange).toHaveBeenLastCalledWith(0);
  });
});

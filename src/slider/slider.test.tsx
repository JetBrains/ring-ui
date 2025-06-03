import {fireEvent, render, screen} from '@testing-library/react';
import {ComponentProps} from 'react';

import {Slider} from './slider';

const DEFAULT_VALUE = 42;

describe('Slider', () => {
  const renderSlider = (props?: ComponentProps<typeof Slider>) => render(<Slider {...props} />);

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
});

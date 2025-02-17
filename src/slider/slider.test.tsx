import {fireEvent, render, screen} from '@testing-library/react';
import {ComponentProps} from 'react';

import {Slider} from './slider';

const DEFAULT_VALUE = 42;

describe('Slider', () => {
  const renderSlider = (props?: ComponentProps<typeof Slider>) => render(<Slider {...props} />);

  it('should create component', () => {
    const {container} = renderSlider();
    container.firstElementChild?.should.exist;
  });

  it('should use passed className', () => {
    const {container} = renderSlider({className: 'test-class'});
    container.querySelector('.test-class')?.should.exist;
  });

  it('should use min value when defaultValue or value are unspecified', () => {
    renderSlider({min: DEFAULT_VALUE, showTag: true});
    screen.getByText(DEFAULT_VALUE).should.exist;
    screen.getByRole('tooltip').should.exist;
  });

  it('should use values in range', () => {
    const RIGHT = 101;
    renderSlider({defaultValue: [-1, RIGHT], showTag: true});
    const tooltips = screen.getAllByRole('tooltip');
    tooltips[0]?.textContent?.should.equal('0');
    tooltips[1]?.textContent?.should.equal('100');
  });

  it('should display a formatted tag', () => {
    renderSlider({
      defaultValue: DEFAULT_VALUE,
      showTag: true,
      renderTag: value => `%${value}%`,
    });
    screen.getByRole('tooltip').textContent?.should.equal(`%${DEFAULT_VALUE}%`);
  });

  it.skip('should handle only 2 values in range', () => {
    const NEW_VALUE = 5;
    const onChange = sandbox.spy();
    const {container} = renderSlider({
      defaultValue: [1, 2, 1, 0],
      onChange,
    });

    const slider = container.firstElementChild!;
    fireEvent.mouseDown(slider, {clientX: 50});
    fireEvent.mouseUp(slider, {clientX: 50});

    onChange.should.have.been.calledWith([1, NEW_VALUE]);
  });

  it.skip('should swap values when one is moved over another', () => {
    const LEFT = 20;
    const RIGHT = 40;
    const NEW_VALUE = 5;
    const onChange = sandbox.spy();

    renderSlider({defaultValue: [LEFT, RIGHT], onChange});
    const thumbs = screen.getAllByRole('slider');

    fireEvent.mouseDown(thumbs[1]); // Second thumb
    fireEvent.mouseUp(document.body, {clientX: 50});

    onChange.should.have.been.calledWith([NEW_VALUE, LEFT]);
  });
});

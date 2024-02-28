import {mount} from 'enzyme';
import React, {ComponentProps} from 'react';

import {fireEvent, render, screen} from '@testing-library/react';

import {Slider} from './slider';

const DEFAULT_VALUE = 42;

describe('Slider', () => {
  const mountSlider = (params?: ComponentProps<typeof Slider>) => mount(<Slider {...params}/>);
  const renderSlider = (params?: ComponentProps<typeof Slider>) => render(<Slider {...params}/>);

  const focusThumb = () => {
    const onChange = sandbox.spy();
    renderSlider({defaultValue: DEFAULT_VALUE, onChange});
    const thumb = screen.queryByRole('slider')!;
    thumb.focus();
    return {onChange, thumb};
  };

  it('should create component', () => {
    mountSlider().should.have.type(Slider);
  });

  it('should use passed className', () => {
    mountSlider({className: 'test-class'}).find(Slider).should.have.className('test-class');
  });

  it('should use min value when defaultValue or value are unspecified', () => {
    renderSlider({min: DEFAULT_VALUE, showTag: true});
    screen.getByText(DEFAULT_VALUE);
    should.exist(screen.queryByRole('tooltip'));
  });

  it('should use values in range', () => {
    const RIGHT = 101;
    renderSlider({defaultValue: [-1, RIGHT], showTag: true});
    const tooltips = screen.queryAllByRole('tooltip');
    tooltips[0]?.should.have.text('0');
    tooltips[1]?.should.have.text('100');
  });

  it('should display a formatted tag', () => {
    renderSlider({defaultValue: DEFAULT_VALUE, showTag: true, renderTag: value => `%${value}%`});
    screen.queryByRole('tooltip')?.should.have.text(`%${DEFAULT_VALUE}%`);
  });

  it('should handle ArrowRight/ArrowUp key', () => {
    const {onChange, thumb} = focusThumb();
    fireEvent.keyDown(thumb, {key: 'ArrowRight'});
    onChange.should.have.been.calledWith(DEFAULT_VALUE + 1);
    fireEvent.keyDown(thumb, {key: 'ArrowUp'});
    onChange.should.have.been.calledWith(DEFAULT_VALUE + 2);
  });

  it('should handle ArrowLeft/ArrowDown key', () => {
    const {onChange, thumb} = focusThumb();
    fireEvent.keyDown(thumb, {key: 'ArrowLeft'});
    onChange.should.have.been.calledWith(DEFAULT_VALUE - 1);
    fireEvent.keyDown(thumb, {key: 'ArrowDown'});
    onChange.should.have.been.calledWith(DEFAULT_VALUE - 2);
  });

  it('should handle Home key', () => {
    const {onChange, thumb} = focusThumb();
    fireEvent.keyDown(thumb, {key: 'Home'});
    onChange.should.have.been.calledWith(0);
  });

  it('should handle End key', () => {
    const MAX = 100;
    const {onChange, thumb} = focusThumb();
    fireEvent.keyDown(thumb, {key: 'End'});
    onChange.should.have.been.calledWith(MAX);
  });

  it('should handle only 2 values in range', () => {
    const NEW_VALUE = 5;
    const onChange = sandbox.spy();
    const {container: {firstElementChild}} = renderSlider({defaultValue: [1, 2, 1, 0], onChange});
    should.exist(firstElementChild);
    fireEvent.mouseDown(firstElementChild!, {clientX: 50});
    fireEvent.mouseUp(firstElementChild!, {clientX: 50});
    onChange.should.have.been.calledWith([1, NEW_VALUE]);
  });

  it('should swap values when one is moved over another', () => {
    const LEFT = 20;
    const RIGHT = 40;
    const NEW_VALUE = 5;
    const onChange = sandbox.spy();
    const wrapper = renderSlider({defaultValue: [LEFT, RIGHT], onChange});
    const [, thumb] = wrapper.queryAllByRole('slider');
    fireEvent.mouseDown(thumb!);
    fireEvent.mouseUp(wrapper.container, {clientX: 50});
    onChange.should.have.been.calledWith([NEW_VALUE, LEFT]);
  });
});

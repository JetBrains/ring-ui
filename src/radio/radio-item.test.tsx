import {screen, render, fireEvent} from '@testing-library/react';

import {RadioItemInner, type RadioItemInnerProps} from './radio-item';

describe('Radio Item', () => {
  function noop() {}

  const factory = (props?: RadioItemInnerProps) => (
    <RadioItemInner checked={false} onChange={noop} value='test' {...props}>
      {'test'}
    </RadioItemInner>
  );
  const renderRadioItem = (props?: RadioItemInnerProps) => {
    render(factory(props));
    return screen.getAllByRole<HTMLInputElement>('radio')[0];
  };

  it('should render radio item', () => {
    expect(renderRadioItem()).to.exist;
  });

  it('should generate id if not passed', () => {
    expect(renderRadioItem()).to.have.property('id');
  });

  it('should generate unique id', () => {
    renderRadioItem();
    renderRadioItem();
    const [firstRadioItem, secondRadioItem] = screen.getAllByRole('radio');
    const secondRadioId = secondRadioItem.getAttribute('id') ?? '';
    expect(firstRadioItem).to.not.have.id(secondRadioId);
  });

  it('should set custom id', () => {
    const radioItem = renderRadioItem({
      id: 'test',
    });

    expect(radioItem).to.have.id('test');
  });

  it('should set name', () => {
    const radioItem = renderRadioItem({
      name: 'test',
    });

    expect(radioItem).to.have.property('name', 'test');
  });

  it('should call handler for click event', () => {
    const clickHandler = vi.fn();
    const radioItem = renderRadioItem({
      onClick: clickHandler,
    });

    fireEvent.click(radioItem);
    expect(clickHandler).toHaveBeenCalled();
  });

  it('should be unchecked by default', () => {
    const radioItem = renderRadioItem();

    expect(radioItem).to.not.have.property('checked', true);
  });

  it('should check control', () => {
    const radioItem = renderRadioItem({
      checked: true,
      onChange: () => {}, // avoid "checked without onChange" warning
    });

    expect(radioItem).to.have.property('checked', true);
  });

  it('should be disabled', () => {
    const radioItem = renderRadioItem({
      disabled: true,
    });

    expect(radioItem.disabled).to.be.true;
  });

  it('should connect labels with input', () => {
    renderRadioItem();

    expect(screen.getByRole('radio', {name: 'test'})).to.exist;
  });

  it('should render default data-test on the label when no containerDataTest is passed', () => {
    const radioItem = renderRadioItem();
    const label = radioItem.closest('label');

    expect(label).to.have.attribute('data-test', 'ring-radio-item');
  });

  it('should compose containerDataTest with the default data-test on the label', () => {
    const radioItem = renderRadioItem({containerDataTest: 'my-radio'});
    const label = radioItem.closest('label');

    expect(label).to.have.attribute('data-test', 'ring-radio-item my-radio');
  });
});

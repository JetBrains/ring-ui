import {InputHTMLAttributes} from 'react';

import {screen, render, fireEvent} from '@testing-library/react';

import {RadioItemInner} from './radio__item';

describe('Radio Item', () => {
  function noop() {}

  const factory = (props?: InputHTMLAttributes<HTMLInputElement>) => (
    <RadioItemInner checked={false} onChange={noop} value="test" {...props}>
      {'test'}
    </RadioItemInner>
  );
  const renderRadioItem = (props?: InputHTMLAttributes<HTMLInputElement>) => {
    render(factory(props));
    return screen.getAllByRole<HTMLInputElement>('radio')[0];
  };

  it('should render radio item', () => {
    renderRadioItem().should.exist;
  });

  it('should generate id if not passed', () => {
    renderRadioItem().should.have.property('id');
  });

  it('should generate unique id', () => {
    renderRadioItem();
    renderRadioItem();
    const [firstRadioItem, secondRadioItem] = screen.getAllByRole('radio');
    const secondRadioId = secondRadioItem.getAttribute('id') ?? '';
    firstRadioItem.should.not.have.id(secondRadioId);
  });

  it('should set custom id', () => {
    const radioItem = renderRadioItem({
      id: 'test',
    });

    radioItem.should.have.id('test');
  });

  it('should set name', () => {
    const radioItem = renderRadioItem({
      name: 'test',
    });

    radioItem.should.have.property('name', 'test');
  });

  it('should call handler for click event', () => {
    const clickHandler = sandbox.stub();
    const radioItem = renderRadioItem({
      onClick: clickHandler,
    });

    fireEvent.click(radioItem);
    clickHandler.should.have.been.called;
  });

  it('should be unchecked by default', () => {
    const radioItem = renderRadioItem();

    radioItem.should.not.have.property('checked', true);
  });

  it('should check control', () => {
    const radioItem = renderRadioItem({
      checked: true,
      onChange: () => {}, // avoid "checked without onChange" warning
    });

    radioItem.should.have.property('checked', true);
  });

  it('should be disabled', () => {
    const radioItem = renderRadioItem({
      disabled: true,
    });

    radioItem.disabled.should.be.true;
  });

  it('should connect labels with input', () => {
    renderRadioItem();

    screen.getByRole('radio', {name: 'test'}).should.exist;
  });
});

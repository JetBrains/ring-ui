import {render, screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Checkbox, {type CheckboxProps} from './checkbox';

type CheckboxAttributes = React.JSX.LibraryManagedAttributes<typeof Checkbox, CheckboxProps>;

describe('Checkbox', () => {
  const renderCheckbox = (props?: CheckboxAttributes) => {
    render(<Checkbox {...props} />);
    return screen.getByRole<HTMLInputElement>('checkbox');
  };

  it('should create component', () => {
    expect(renderCheckbox()).to.exist;
  });

  it('should render checkbox', () => {
    const checkbox = renderCheckbox();
    expect(checkbox).to.have.property('type', 'checkbox');
  });

  it('should set name', () => {
    const checkbox = renderCheckbox({name: 'test'});

    expect(checkbox).to.have.property('name', 'test');
  });

  it('should call handler for click event', () => {
    const clickHandler = vi.fn();

    const checkbox = renderCheckbox({onClick: clickHandler});
    fireEvent.click(checkbox);

    expect(clickHandler).toHaveBeenCalled();
  });

  it('should not call handler on change event if disabled', () => {
    const onChange = vi.fn();

    const checkbox = renderCheckbox({
      disabled: true,
      onChange,
    });

    userEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled;
  });

  it('should be unchecked by default', () => {
    const checkbox = renderCheckbox();

    expect(checkbox.checked).to.be.false;
  });

  it('should check control', () => {
    const checkbox = renderCheckbox({defaultChecked: true});

    expect(checkbox.checked).to.be.true;
  });

  it('should be disabled', () => {
    const checkbox = renderCheckbox({
      disabled: true,
    });

    expect(checkbox.disabled).to.be.true;
  });

  it('should check control on change event', () => {
    const eventMock = {
      target: {
        checked: true,
      } as HTMLInputElement,
    };
    const checkbox = renderCheckbox();

    fireEvent.change(checkbox, eventMock);
    expect(checkbox.value).to.equal('on');
  });

  it('should render default data-test on the label when no containerDataTest is passed', () => {
    const checkbox = renderCheckbox();
    const label = checkbox.closest('label');

    expect(label).to.have.attribute('data-test', 'ring-checkbox');
  });

  it('should compose containerDataTest with the default data-test on the label', () => {
    const checkbox = renderCheckbox({containerDataTest: 'my-cb'});
    const label = checkbox.closest('label');

    expect(label).to.have.attribute('data-test', 'ring-checkbox my-cb');
  });
});

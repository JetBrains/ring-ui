import {render, screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Checkbox, {CheckboxProps} from './checkbox';

type CheckboxAttributes = React.JSX.LibraryManagedAttributes<typeof Checkbox, CheckboxProps>;

describe('Checkbox', () => {
  const renderCheckbox = (props?: CheckboxAttributes) => {
    render(<Checkbox {...props} />);
    return screen.getByRole<HTMLInputElement>('checkbox');
  };

  it('should create component', () => {
    renderCheckbox().should.exist;
  });

  it('should render checkbox', () => {
    const checkbox = renderCheckbox();
    checkbox.should.have.property('type', 'checkbox');
  });

  it('should set name', () => {
    const checkbox = renderCheckbox({name: 'test'});

    checkbox.should.have.property('name', 'test');
  });

  it('should call handler for click event', () => {
    const clickHandler = sandbox.stub();

    const checkbox = renderCheckbox({onClick: clickHandler});
    fireEvent.click(checkbox);

    clickHandler.should.have.been.called;
  });

  it('should not call handler on change event if disabled', () => {
    const onChange = sandbox.stub();

    const checkbox = renderCheckbox({
      disabled: true,
      onChange,
    });

    userEvent.click(checkbox);
    onChange.should.have.not.been.called;
  });

  it('should be unchecked by default', () => {
    const checkbox = renderCheckbox();

    checkbox.checked.should.be.false;
  });

  it('should check control', () => {
    const checkbox = renderCheckbox({defaultChecked: true});

    checkbox.checked.should.be.true;
  });

  it('should be disabled', () => {
    const checkbox = renderCheckbox({
      disabled: true,
    });

    checkbox.should.be.disabled;
  });

  it('should check control on change event', () => {
    const eventMock = {
      target: {
        checked: true,
      } as HTMLInputElement,
    };
    const checkbox = renderCheckbox();

    fireEvent.change(checkbox, eventMock);
    checkbox.should.be.checked;
  });
});

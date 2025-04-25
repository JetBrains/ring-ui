import {render, screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ListItem from './list__item';
import {ListDataItemProps} from './consts';

describe('ListItem', () => {
  const renderListItem = (props?: Partial<ListDataItemProps>) => render(<ListItem {...(props as ListDataItemProps)} />);

  it('should create component', () => {
    renderListItem();
    expect(screen.getByTestId('ring-list-item ring-list-item-action')).to.exist;
  });

  it('should use passed className', () => {
    renderListItem({className: 'test-class'});
    expect(screen.getByRole('button')).to.have.class('test-class');
  });

  it('should add data test attributes', () => {
    renderListItem();
    expect(screen.getByTestId('ring-list-item ring-list-item-action')).to.exist;
  });

  it('should remove ring-list-item-action data-test attribute if item is disabled', () => {
    renderListItem({disabled: true});
    expect(screen.getByTestId('ring-list-item')).to.exist;
    expect(screen.queryByTestId('ring-list-item-action')).to.be.null;
  });

  it('should add data-test attribute if item is selected', () => {
    renderListItem({checkbox: false});
    expect(screen.getByTestId('ring-list-item ring-list-item-action')).to.exist;

    renderListItem({checkbox: true});
    expect(screen.getByTestId('ring-list-item ring-list-item-action ring-list-item-selected')).to.exist;
  });

  it('should render checkbox icon', () => {
    const {container} = renderListItem({checkbox: true});
    const checkbox = container.querySelector('[type=checkbox]') as HTMLInputElement;
    expect(checkbox).to.exist;
    expect(checkbox.checked).to.be.true;
  });

  it('should not render checkbox icon if not passed', () => {
    const {container} = renderListItem({checkbox: undefined});
    expect(container.querySelector('[type=checkbox]')).to.be.null;
  });

  it('should not render check mark icon', () => {
    renderListItem();
    expect(screen.queryByTestId('ring-icon')).to.be.null;
  });

  it('should handle click', async () => {
    const onClick = sandbox.stub();
    renderListItem({onClick});

    const button = screen.getByRole('button');
    const user = userEvent.setup();
    await user.click(button);

    expect(onClick).to.have.been.called;
  });

  it('should handle checkbox change', () => {
    const onCheckboxChange = sandbox.stub();
    renderListItem({checkbox: true, onCheckboxChange});

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onCheckboxChange).to.have.been.called;
  });
});

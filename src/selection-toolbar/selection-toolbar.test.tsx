import {createRef} from 'react';
import {render, screen} from '@testing-library/react';

import SelectionToolbar, {SelectionToolbarSeparator} from './selection-toolbar';

describe('SelectionToolbar', () => {
  const closeAction = <button type='button'>{'Clear selection'}</button>;

  it('renders its slots and accessibility semantics', () => {
    render(
      <SelectionToolbar
        label='2 items selected'
        selectAll={<button type='button'>{'Select all'}</button>}
        closeAction={closeAction}
        aria-label='Selected item actions'
      >
        <button type='button'>{'Edit'}</button>
        <SelectionToolbarSeparator />
      </SelectionToolbar>,
    );

    expect(screen.getByRole('group', {name: 'Selected item actions'})).to.exist;
    expect(screen.getByText('2 items selected')).to.exist;
    expect(screen.getByRole('button', {name: 'Select all'})).to.exist;
    expect(screen.getByRole('button', {name: 'Edit'})).to.exist;
    expect(screen.getByRole('button', {name: 'Clear selection'})).to.exist;
    expect(screen.getByRole('separator')).to.have.attribute('aria-orientation', 'vertical');
  });

  it('omits select-all content when it is not supplied', () => {
    render(<SelectionToolbar label='All selected' closeAction={closeAction} />);
    expect(screen.getByRole('group', {name: 'All selected'})).to.exist;
    expect(screen.queryByRole('button', {name: 'Select all'})).to.be.null;
  });

  it('renders valid falsy select-all content', () => {
    render(<SelectionToolbar label='Selected' selectAll={0} closeAction={closeAction} />);
    expect(screen.getByText('0')).to.exist;
  });

  it('forwards attributes, class name, ref, data-test, and compact state', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <SelectionToolbar
        ref={ref}
        label='Selected'
        closeAction={closeAction}
        compact
        className='custom'
        title='Selection actions'
        data-test='consumer-toolbar'
      />,
    );

    expect(ref.current).to.equal(screen.getByRole('group'));
    expect(ref.current).to.have.class('custom');
    expect(ref.current?.className).to.contain('compact');
    expect(ref.current).to.have.attribute('title', 'Selection actions');
    expect(ref.current).to.have.attribute('data-test', 'ring-selection-toolbar consumer-toolbar');
  });
});

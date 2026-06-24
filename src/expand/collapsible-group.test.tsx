import {createRef} from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CollapsibleGroup from './collapsible-group';

// Compatibility smoke test for the deprecated `expand` import path.
// Full behavior is covered by `../collapsible-group/collapsible-group.test.tsx`.
describe('<CollapsibleGroup /> (deprecated expand path)', () => {
  it('forwards ref and props through to the renamed component', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <CollapsibleGroup ref={ref} title={'Title'} data-test='deprecated-expand'>
        {'Body content'}
      </CollapsibleGroup>,
    );

    expect(ref.current).toBe(document.querySelector('[data-test="deprecated-expand"]'));
    expect(screen.getByRole('button', {name: 'Title'})).not.toBeNull();
  });

  it('toggles on click', async () => {
    render(<CollapsibleGroup title={'Title'}>{'Body content'}</CollapsibleGroup>);

    const header = screen.getByRole('button', {name: 'Title'});
    expect(header.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('Body content')).toBeNull();

    await userEvent.click(header);

    expect(header.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Body content')).not.toBeNull();
  });
});

import {useState} from 'react';
import * as React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {COLLAPSE_CONTENT_CONTAINER_TEST_ID} from '../collapse/consts';
import CollapsibleGroup from './collapsible-group';

import collapseStyles from '../collapse/collapse.css';
import styles from './collapsible-group.css';

const bodyText = 'Body content';

const renderExpand = (props: Partial<React.ComponentProps<typeof CollapsibleGroup>> = {}) =>
  render(
    <CollapsibleGroup title={'Title'} {...props}>
      {bodyText}
    </CollapsibleGroup>,
  );

describe('<CollapsibleGroup />', () => {
  it('should toggle on click and keyboard', async () => {
    const onChangeCalls: boolean[] = [];
    const onChangeMock = (nextExpanded: boolean) => {
      onChangeCalls.push(nextExpanded);
    };
    renderExpand({onChange: onChangeMock});

    const header = screen.getByRole('button', {name: 'Title'});

    expect(header.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText(bodyText)).toBeNull();

    await userEvent.click(header);

    expect(onChangeCalls).toEqual([true]);
    expect(header.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText(bodyText)).not.toBeNull();

    header.focus();
    await userEvent.keyboard(' ');

    expect(onChangeCalls).toEqual([true, false]);
    expect(header.getAttribute('aria-expanded')).toBe('false');
  });

  it('should support controlled and uncontrolled usage', async () => {
    renderExpand({defaultExpanded: true});

    const uncontrolledHeader = screen.getByRole('button', {name: 'Title'});
    expect(uncontrolledHeader.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText(bodyText)).not.toBeNull();

    const Controlled = () => {
      const [expanded, setExpanded] = useState(false);

      return (
        <CollapsibleGroup title={'Controlled'} expanded={expanded} onChange={setExpanded}>
          {'Controlled body'}
        </CollapsibleGroup>
      );
    };

    render(<Controlled />);

    const controlledHeader = screen.getByRole('button', {name: 'Controlled'});
    expect(controlledHeader.getAttribute('aria-expanded')).toBe('false');

    await userEvent.click(controlledHeader);

    expect(controlledHeader.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Controlled body')).not.toBeNull();
  });

  it('should ignore interactions when interactive is false', async () => {
    const onChangeCalls: boolean[] = [];
    const onChangeMock = (nextExpanded: boolean) => {
      onChangeCalls.push(nextExpanded);
    };
    renderExpand({interactive: false, onChange: onChangeMock});

    expect(screen.queryByRole('button', {name: 'Title'})).toBeNull();

    await userEvent.click(screen.getByText('Title'));

    expect(onChangeCalls).toHaveLength(0);
  });

  it('should keep hover and focus styles scoped to the interactive header', async () => {
    const user = userEvent.setup();

    render(
      <CollapsibleGroup title={'Title'} defaultExpanded data-test='expand'>
        <button type='button'>{'Action'}</button>
      </CollapsibleGroup>,
    );

    const root = document.querySelector('[data-test="expand"]') as HTMLDivElement;
    const header = screen.getByRole('button', {name: 'Title'});
    const bodyButton = screen.getByRole('button', {name: 'Action'});

    expect(root.className).not.toContain(styles.hovered);
    expect(root.className).not.toContain(styles.focused);

    await userEvent.hover(header);
    expect(root.className).toContain(styles.hovered);

    await userEvent.unhover(header);
    expect(root.className).not.toContain(styles.hovered);

    await user.tab();
    expect(root.className).toContain(styles.focused);

    await user.tab();
    expect(document.activeElement).toBe(bodyButton);
    expect(root.className).not.toContain(styles.focused);
  });

  it('should support disabling animation', async () => {
    renderExpand({disableAnimation: true});

    const header = screen.getByRole('button', {name: 'Title'});
    const content = document.querySelector(`[data-test="${COLLAPSE_CONTENT_CONTAINER_TEST_ID}"]`);

    expect(content).not.toBeNull();
    expect(content?.className).not.toContain(collapseStyles.transition);

    await userEvent.click(header);

    expect(screen.getByText(bodyText)).not.toBeNull();
  });
});

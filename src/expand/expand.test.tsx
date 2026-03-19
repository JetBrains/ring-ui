import {useState} from 'react';
import * as React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {COLLAPSE_CONTENT_CONTAINER_TEST_ID} from '../collapse/consts';
import Expand from './expand';

import collapseStyles from '../collapse/collapse.css';
import styles from './expand.css';

const bodyText = 'Body content';

const renderExpand = (props: Partial<React.ComponentProps<typeof Expand>> = {}) =>
  render(
    <Expand title={'Title'} {...props}>
      {bodyText}
    </Expand>,
  );

describe('<Expand />', () => {
  it('should toggle on click and keyboard', async () => {
    const onChangeCalls: boolean[] = [];
    const onChangeMock = (nextExpanded: boolean) => {
      onChangeCalls.push(nextExpanded);
    };
    renderExpand({onChange: onChangeMock});

    const header = screen.getByRole('button', {name: 'Title'});

    expect(header.getAttribute('aria-expanded')).to.equal('false');
    expect(screen.queryByText(bodyText)).to.equal(null);

    await userEvent.click(header);

    expect(onChangeCalls).to.deep.equal([true]);
    expect(header.getAttribute('aria-expanded')).to.equal('true');
    expect(screen.getByText(bodyText)).to.exist;

    header.focus();
    await userEvent.keyboard(' ');

    expect(onChangeCalls).to.deep.equal([true, false]);
    expect(header.getAttribute('aria-expanded')).to.equal('false');
  });

  it('should support controlled and uncontrolled usage', async () => {
    renderExpand({defaultExpanded: true});

    const uncontrolledHeader = screen.getByRole('button', {name: 'Title'});
    expect(uncontrolledHeader.getAttribute('aria-expanded')).to.equal('true');
    expect(screen.getByText(bodyText)).to.exist;

    const Controlled = () => {
      const [expanded, setExpanded] = useState(false);

      return (
        <Expand title={'Controlled'} expanded={expanded} onChange={setExpanded}>
          {'Controlled body'}
        </Expand>
      );
    };

    render(<Controlled />);

    const controlledHeader = screen.getByRole('button', {name: 'Controlled'});
    expect(controlledHeader.getAttribute('aria-expanded')).to.equal('false');

    await userEvent.click(controlledHeader);

    expect(controlledHeader.getAttribute('aria-expanded')).to.equal('true');
    expect(screen.getByText('Controlled body')).to.exist;
  });

  it('should ignore interactions when interactive is false', async () => {
    const onChangeCalls: boolean[] = [];
    const onChangeMock = (nextExpanded: boolean) => {
      onChangeCalls.push(nextExpanded);
    };
    renderExpand({interactive: false, onChange: onChangeMock});

    expect(screen.queryByRole('button', {name: 'Title'})).to.equal(null);

    await userEvent.click(screen.getByText('Title'));

    expect(onChangeCalls).to.have.lengthOf(0);
  });

  it('should keep hover and focus styles scoped to the interactive header', async () => {
    const user = userEvent.setup();

    render(
      <Expand title={'Title'} defaultExpanded data-test='expand'>
        <button type='button'>{'Action'}</button>
      </Expand>,
    );

    const root = document.querySelector('[data-test="expand"]') as HTMLDivElement;
    const header = screen.getByRole('button', {name: 'Title'});
    const bodyButton = screen.getByRole('button', {name: 'Action'});

    expect(root.className).not.to.contain(styles.hovered);
    expect(root.className).not.to.contain(styles.focused);

    await userEvent.hover(header);
    expect(root.className).to.contain(styles.hovered);

    await userEvent.unhover(header);
    expect(root.className).not.to.contain(styles.hovered);

    await user.tab();
    expect(root.className).to.contain(styles.focused);

    await user.tab();
    expect(document.activeElement).to.equal(bodyButton);
    expect(root.className).not.to.contain(styles.focused);
  });

  it('should support disabling animation', async () => {
    renderExpand({disableAnimation: true});

    const header = screen.getByRole('button', {name: 'Title'});
    const content = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

    expect(content.className).not.to.contain(collapseStyles.transition);

    await userEvent.click(header);

    expect(screen.getByText(bodyText)).to.exist;
  });
});

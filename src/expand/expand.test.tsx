import {useState} from 'react';
import * as React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Expand from './expand';

const bodyText = 'Body content';

const renderExpand = (props: Partial<React.ComponentProps<typeof Expand>> = {}) =>
  render(
    <Expand title={'Title'} {...props}>
      {bodyText}
    </Expand>,
  );

describe('<Expand />', () => {
  it('should toggle on click and keyboard', async () => {
    const onChangeMock = vi.fn();
    renderExpand({onChange: onChangeMock});

    const header = screen.getByRole('button', {name: 'Title'});

    expect(header.getAttribute('aria-expanded')).to.equal('false');
    expect(screen.queryByText(bodyText)).to.equal(null);

    await userEvent.click(header);

    expect(onChangeMock).toHaveBeenCalledWith(true);
    expect(header.getAttribute('aria-expanded')).to.equal('true');
    expect(screen.getByText(bodyText)).to.exist;

    header.focus();
    await userEvent.keyboard(' ');

    expect(onChangeMock).toHaveBeenCalledWith(false);
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
    const onChangeMock = vi.fn();
    renderExpand({interactive: false, onChange: onChangeMock});

    expect(screen.queryByRole('button', {name: 'Title'})).to.equal(null);

    await userEvent.click(screen.getByText('Title'));

    expect(onChangeMock).not.toHaveBeenCalled();
  });
});

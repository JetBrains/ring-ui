import React, {useState} from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {COLLAPSE_CONTROL_TEST_ID, COLLAPSE_CONTENT_CONTAINER_TEST_ID} from './consts';

import {Collapse} from './collapse';
import {CollapseContent} from './collapse-content';
import {CollapseControl} from './collapse-control';

import styles from './collapse.css';

const textMock = `This is very long text! This is very long text! This is very long text! This is very
            long text! This is very long text! This is very long text! This is very long text! This
            is very long text! This is very long text! This is very long text! This is very long
            text! This is very long text! This is very long text! This is very long text! This is
            very long text! This is very long text! This is very long text! This is very long text!
            This is very long text! This is very long text! This is very long text!`;
const MIN_HEIGHT = 50;
const DEFAULT_HEIGHT = 0;
const CONTENT_HEIGHT = 74;
const LARGE_HEIGHT = CONTENT_HEIGHT * 2;

const onChangeMock = sandbox.stub();

const Dummy = ({
  minHeight,
  disableAnimation,
  controlAsFunc
}: {
  minHeight: number;
  disableAnimation: boolean;
  controlAsFunc: boolean;
}) => {
  const [text, setText] = useState(textMock);

  return (
    <>
      <button type="button" onClick={() => setText(`${textMock}${textMock}`)}>
        {'More text'}
      </button>
      <Collapse onChange={onChangeMock}>
        <CollapseControl>
          {controlAsFunc
            ? (
              <button type="button">{'Show text'}</button>
            )
            : (collapsed: boolean) => (
              <button type="button">{collapsed ? 'Show text' : 'Hide text'}</button>
            )
          }
        </CollapseControl>
        <CollapseContent disableAnimation={disableAnimation} minHeight={minHeight}>
          {text}
        </CollapseContent>
      </Collapse>
    </>
  );
};

function renderComponent(minHeight = 0, disableAnimation = false, controlAsFunc = false) {
  return render(
    <Dummy
      minHeight={minHeight}
      disableAnimation={disableAnimation}
      controlAsFunc={controlAsFunc}
    />
  );
}

describe('<Collapse />', () => {
  it('should be able to expand and collapse', async () => {
    renderComponent();
    const button = screen.getByTestId(COLLAPSE_CONTROL_TEST_ID);

    await userEvent.click(button);

    const content = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

    onChangeMock.should.have.been.calledWith(false);
    content.style.height.should.equal(`${CONTENT_HEIGHT}px`);

    await userEvent.click(button);

    content.style.height.should.equal(`${DEFAULT_HEIGHT}px`);
    onChangeMock.should.have.been.calledWith(true);
  });

  it('should correctly behave with minHeight prop', async () => {
    renderComponent(MIN_HEIGHT);
    const button = screen.getByTestId(COLLAPSE_CONTROL_TEST_ID);

    const content = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

    content.style.height.should.equal(`${MIN_HEIGHT}px`);

    await userEvent.click(button);

    content.style.height.should.equal(`${CONTENT_HEIGHT}px`);
  });

  it('should resize the collapsable container if content has been changed', async () => {
    renderComponent();

    const button = screen.getByTestId(COLLAPSE_CONTROL_TEST_ID);

    await userEvent.click(button);

    const content = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

    const moreTextButton = screen.getByText('More text');

    await userEvent.click(moreTextButton);

    content.style.height.should.equal(`${LARGE_HEIGHT}px`);
  });

  it('should disable animation', () => {
    renderComponent(0, true);

    const content = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

    content.className.should.not.include(styles.transition);
  });

  it('should use control as render prop', () => {
    renderComponent(0, true);

    const content = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

    content.className.should.not.include(styles.transition);
  });
});

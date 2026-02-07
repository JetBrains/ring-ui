import {type PropsWithChildren, useState} from 'react';
import * as React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterAll, describe, expect} from 'vitest';
import {screen as shadowScreen} from 'shadow-dom-testing-library';

import {COLLAPSE_CONTENT_CONTAINER_TEST_ID, COLLAPSE_CONTENT_TEST_ID} from './consts';
import {Collapse} from './collapse';
import {CollapseContent} from './collapse-content';
import {CollapseControl} from './collapse-control';
import {ShadowRootWrap} from './shadow-root-test-helpers';

import styles from './collapse.css';

const textMock = `This is very long text! This is very long text! This is very long text! This is very
            long text! This is very long text! This is very long text! This is very long text! This
            is very long text! This is very long text! This is very long text! This is very long
            text! This is very long text! This is very long text! This is very long text! This is
            very long text! This is very long text! This is very long text! This is very long text!
            This is very long text! This is very long text! This is very long text!`;
const MIN_HEIGHT = 50;
const CONTENT_HEIGHT = 75;
const LARGE_HEIGHT = CONTENT_HEIGHT * 2;
const TextWrapper: React.FC<PropsWithChildren> = ({children}) => (
  <div style={{height: `${CONTENT_HEIGHT}px`}}>{children}</div>
);

const onChangeMock = vi.fn();

const Dummy = ({
  minHeight,
  disableAnimation,
  controlAsFunc,
  defaultCollapsed = true,
  collapsed = null,
}: {
  minHeight: number;
  disableAnimation: boolean;
  controlAsFunc: boolean;
  defaultCollapsed: boolean;
  collapsed: boolean | null;
}) => {
  const [texts, setTexts] = useState([textMock]);

  return (
    <>
      <button type='button' onClick={() => setTexts([...texts, textMock])}>
        {'More text'}
      </button>
      <Collapse
        onChange={onChangeMock}
        disableAnimation={disableAnimation}
        defaultCollapsed={defaultCollapsed}
        collapsed={collapsed}
      >
        <CollapseControl>
          {controlAsFunc ? (
            <button type='button'>{'Show text'}</button>
          ) : (
            (isCollapsed: boolean) => <button type='button'>{isCollapsed ? 'Show text' : 'Hide text'}</button>
          )}
        </CollapseControl>
        <CollapseContent minHeight={minHeight}>
          {texts.map((text, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <TextWrapper key={index}>{text}</TextWrapper>
          ))}
        </CollapseContent>
      </Collapse>
    </>
  );
};

function renderComponent(
  minHeight = 0,
  disableAnimation = false,
  controlAsFunc = false,
  defaultCollapsed = true,
  collapsed = null,
) {
  return render(
    <Dummy
      minHeight={minHeight}
      disableAnimation={disableAnimation}
      controlAsFunc={controlAsFunc}
      defaultCollapsed={defaultCollapsed}
      collapsed={collapsed}
    />,
  );
}

describe('<Collapse />', () => {
  it('should be able to expand and collapse', async () => {
    renderComponent();
    const button = screen.getByRole('button', {name: 'Show text'});

    await userEvent.click(button);

    const content = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

    expect(onChangeMock).toHaveBeenCalledWith(false);
    expect(content.style.opacity).to.equal('1');

    await userEvent.click(button);

    expect(content.style.opacity).to.equal('0');
    expect(onChangeMock).toHaveBeenCalledWith(true);
  });

  it('should correctly behave with minHeight prop', async () => {
    renderComponent(MIN_HEIGHT);
    const button = screen.getByRole('button', {name: 'Show text'});

    const content = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

    expect(content.style.height).to.equal(`${MIN_HEIGHT}px`);

    await userEvent.click(button);

    expect(content.style.opacity).to.equal('1');
  });

  it.skip('should resize the collapsible container if content has been changed', async () => {
    renderComponent();

    const button = screen.getByRole('button', {name: 'Show text'});

    await userEvent.click(button);

    const content = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

    const moreTextButton = screen.getByText('More text');

    await userEvent.click(moreTextButton);

    await waitFor(() => expect(content.style.height).to.equal(`${LARGE_HEIGHT}px`));
  });

  it('should disable animation', () => {
    renderComponent(0, true);

    const content = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

    expect(content.className).to.not.include(styles.transition);
  });

  it('should use control as render prop', () => {
    renderComponent(0, true);

    const content = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

    expect(content.className).to.not.include(styles.transition);
  });

  it('should be able to expand by default', () => {
    renderComponent(0, true, false, false);

    const content = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

    expect(content).to.contain.text(textMock);
  });

  type PartialObserverEntry = Partial<{
    [K in keyof ResizeObserverEntry]: Partial<ResizeObserverEntry[K]>;
  }>;

  describe('with ResizeObserver', () => {
    let observerCallback: (entries: PartialObserverEntry[]) => void;
    const observeMock = vi.fn();
    const disconnectMock = vi.fn();
    const unobserveMock = vi.fn();

    const originalObserver = global.ResizeObserver;

    beforeEach(() => {
      global.ResizeObserver = vi.fn(
        class {
          constructor(cb: ResizeObserverCallback) {
            observerCallback = cb as typeof observerCallback;
          }

          observe = observeMock;
          disconnect = disconnectMock;
          unobserve = unobserveMock;
        },
      );
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    afterAll(() => {
      global.ResizeObserver = originalObserver;
    });

    it('should track height via ResizeObserver and cleanup on unmount', async () => {
      const {unmount} = renderComponent();
      const button = screen.getByRole('button', {name: 'Show text'});
      const contentContainer = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);
      const contentInner = screen.getByTestId(COLLAPSE_CONTENT_TEST_ID);

      expect(observeMock).toHaveBeenCalledWith(contentInner);

      // simulate resize observer firing on element mounting
      observerCallback([
        {
          target: contentInner,
          contentRect: {height: 150},
        },
      ]);

      expect(contentContainer.style.height).to.equal('0px');

      await userEvent.click(button);

      expect(contentContainer.style.height).to.equal('150px');

      await userEvent.click(button);

      expect(contentContainer.style.height).to.equal('0px');

      unmount();

      expect(disconnectMock).to.toHaveBeenCalledTimes(1);
    });

    it('expect to work from inside shadowroot', async () => {
      const {unmount} = render(
        <ShadowRootWrap>
          <Dummy minHeight={0} disableAnimation={false} controlAsFunc={false} defaultCollapsed collapsed={null} />
        </ShadowRootWrap>,
      );

      const button = shadowScreen.getByShadowRole('button', {name: 'Show text'});
      const contentContainer = shadowScreen.getByShadowTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);
      const contentInner = shadowScreen.getByShadowTestId(COLLAPSE_CONTENT_TEST_ID);

      expect(observeMock).toHaveBeenCalledWith(contentInner);

      // simulate resize observer firing on element mounting
      observerCallback([
        {
          target: contentInner,
          contentRect: {height: 150},
        },
      ]);

      expect(contentContainer.style.height).to.equal('0px');

      await userEvent.click(button);

      expect(contentContainer.style.height).to.equal('150px');

      await userEvent.click(button);

      expect(contentContainer.style.height).to.equal('0px');

      unmount();

      expect(disconnectMock).to.toHaveBeenCalledTimes(1);
    });
  });
});

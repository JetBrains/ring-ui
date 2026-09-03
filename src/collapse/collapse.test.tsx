import {type PropsWithChildren, useState} from 'react';
import * as React from 'react';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderToStaticMarkup} from 'react-dom/server';

import {COLLAPSE_CONTENT_CONTAINER_TEST_ID, COLLAPSE_CONTENT_TEST_ID} from './consts';
import {Collapse} from './collapse';
import {CollapseContent} from './collapse-content';
import {CollapseControl} from './collapse-control';

import type * as globalDom from '../global/dom';

import styles from './collapse.css';

const getRectMock = vi.hoisted(() => vi.fn(() => ({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0})));
vi.mock('../global/dom', async importOriginal => ({
  ...(await importOriginal<typeof globalDom>()),
  getRect: getRectMock,
}));

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

// jsdom has no TransitionEvent, so fireEvent.transitionEnd drops propertyName
const fireTransitionEnd = (target: Element, propertyName: string) => {
  const event = new Event('transitionend', {bubbles: true});
  Object.assign(event, {propertyName});
  fireEvent(target, event);
};

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

  it('should animate state changes but not initial expanded renders', () => {
    const {unmount} = renderComponent(0, false, false, false);

    expect(screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID).className).to.not.include(styles.transition);

    unmount();

    const controlled = (collapsed: boolean) => (
      <Collapse collapsed={collapsed}>
        <CollapseContent>{textMock}</CollapseContent>
      </Collapse>
    );
    const {rerender} = render(controlled(false));
    const controlledContent = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

    expect(controlledContent.className).to.not.include(styles.transition);

    rerender(controlled(true));
    expect(controlledContent.className).to.include(styles.transition);
  });

  it('should use control as render prop', () => {
    renderComponent(0, true);

    const content = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

    expect(content.className).to.not.include(styles.transition);
  });

  it('should keep content mounted but hidden when keepMounted is set', async () => {
    render(
      <Collapse keepMounted disableAnimation>
        <CollapseControl>
          <button type='button'>{'Toggle'}</button>
        </CollapseControl>
        <CollapseContent>{textMock}</CollapseContent>
      </Collapse>,
    );

    const content = screen.getByTestId(COLLAPSE_CONTENT_TEST_ID);

    expect(content).to.contain.text(textMock);
    expect(content.style.visibility).to.equal('hidden');
    expect(content.hasAttribute('inert')).to.equal(true);

    await userEvent.click(screen.getByRole('button', {name: 'Toggle'}));

    expect(content.style.visibility).to.equal('');
    expect(content.hasAttribute('inert')).to.equal(false);
    expect(content).to.contain.text(textMock);
  });

  it('should hide kept-mounted content after the collapse transition ends', async () => {
    render(
      <Collapse keepMounted defaultCollapsed={false}>
        <CollapseControl>
          <button type='button'>{'Toggle'}</button>
        </CollapseControl>
        <CollapseContent>{textMock}</CollapseContent>
      </Collapse>,
    );

    const container = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);
    const content = screen.getByTestId(COLLAPSE_CONTENT_TEST_ID);

    expect(content.style.visibility).to.equal('');
    expect(content.hasAttribute('inert')).to.equal(false);

    await userEvent.click(screen.getByRole('button', {name: 'Toggle'}));

    // interaction is blocked immediately on collapse,
    // while the content stays painted during the animation
    expect(content.hasAttribute('inert')).to.equal(true);
    expect(content.style.visibility).to.equal('');

    // a bubbling descendant transition must not finalize the collapse early
    fireTransitionEnd(content, 'height');
    expect(content.style.visibility).to.equal('');

    // neither must a non-height transition of the container itself
    fireTransitionEnd(container, 'opacity');
    expect(content.style.visibility).to.equal('');

    fireTransitionEnd(container, 'height');

    expect(content).to.contain.text(textMock);
    expect(content.style.visibility).to.equal('hidden');
    expect(content.hasAttribute('inert')).to.equal(true);
  });

  it('should hide kept-mounted content even when no transitionend is ever fired', async () => {
    render(
      <Collapse keepMounted duration={1} defaultCollapsed={false}>
        <CollapseControl>
          <button type='button'>{'Toggle'}</button>
        </CollapseControl>
        <CollapseContent>{textMock}</CollapseContent>
      </Collapse>,
    );

    const content = screen.getByTestId(COLLAPSE_CONTENT_TEST_ID);

    await userEvent.click(screen.getByRole('button', {name: 'Toggle'}));

    // jsdom never emits transitionend, so only the fallback timer can hide the content
    await waitFor(() => expect(content.style.visibility).to.equal('hidden'));
    expect(content.hasAttribute('inert')).to.equal(true);
  });

  it('should not restart the hide fallback when kept-mounted content keeps resizing', () => {
    vi.useFakeTimers();
    let resize: (() => void) | undefined;
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          resize = () => callback([], this as unknown as ResizeObserver);
        }

        observe() {}

        unobserve() {}

        disconnect() {}
      },
    );

    try {
      render(
        <Collapse keepMounted defaultCollapsed={false}>
          <CollapseControl>
            <button type='button'>{'Toggle'}</button>
          </CollapseControl>
          <CollapseContent>{textMock}</CollapseContent>
        </Collapse>,
      );

      const content = screen.getByTestId(COLLAPSE_CONTENT_TEST_ID);

      fireEvent.click(screen.getByRole('button', {name: 'Toggle'}));

      // resize more often than the fallback deadline; jsdom never emits transitionend,
      // so only a fallback timer that survives the churn can ever hide the content
      const churnRounds = 10;
      const churnStep = 100;
      let height = 0;
      const churn = () => {
        act(() => {
          resize?.();
          vi.advanceTimersByTime(churnStep);
        });
      };
      for (let i = 0; i < churnRounds; i++) {
        height += churnStep;
        getRectMock.mockReturnValue({top: 0, right: 0, bottom: 0, left: 0, width: 0, height});
        churn();
      }

      expect(content.style.visibility).to.equal('hidden');
      expect(content.hasAttribute('inert')).to.equal(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('should use the fixed collapse duration for any content height', () => {
    vi.useFakeTimers();
    let resize: (() => void) | undefined;
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          resize = () => callback([], this as unknown as ResizeObserver);
        }

        observe() {}

        unobserve() {}

        disconnect() {}
      },
    );

    try {
      render(
        <Collapse keepMounted defaultCollapsed={false}>
          <CollapseControl>
            <button type='button'>{'Toggle'}</button>
          </CollapseControl>
          <CollapseContent>{textMock}</CollapseContent>
        </Collapse>,
      );

      const content = screen.getByTestId(COLLAPSE_CONTENT_TEST_ID);
      const container = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

      getRectMock.mockReturnValue({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 1000});
      act(() => resize?.());

      fireEvent.click(screen.getByRole('button', {name: 'Toggle'}));

      expect(container.style.getPropertyValue('--duration')).to.equal('200ms');

      act(() => vi.advanceTimersByTime(299));
      expect(content.style.visibility).to.equal('');

      act(() => vi.advanceTimersByTime(1));
      expect(content.style.visibility).to.equal('hidden');
      expect(content.hasAttribute('inert')).to.equal(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('should not hide kept-mounted content before the running transition can finish', () => {
    vi.useFakeTimers();

    try {
      render(
        <Collapse keepMounted duration={1000} defaultCollapsed={false}>
          <CollapseControl>
            <button type='button'>{'Toggle'}</button>
          </CollapseControl>
          <CollapseContent>{textMock}</CollapseContent>
        </Collapse>,
      );

      const content = screen.getByTestId(COLLAPSE_CONTENT_TEST_ID);
      fireEvent.click(screen.getByRole('button', {name: 'Toggle'}));

      act(() => vi.advanceTimersByTime(1099));
      expect(content.style.visibility).to.equal('');

      act(() => vi.advanceTimersByTime(1));
      expect(content.style.visibility).to.equal('hidden');
    } finally {
      vi.useRealTimers();
    }
  });

  it('should keep focusable content below a collapsed minHeight preview out of the tab order', async () => {
    render(
      <Collapse>
        <CollapseControl>
          <button type='button'>{'Toggle'}</button>
        </CollapseControl>
        <CollapseContent minHeight={MIN_HEIGHT}>
          <button type='button'>{'Below the preview'}</button>
        </CollapseContent>
      </Collapse>,
    );

    const content = screen.getByTestId(COLLAPSE_CONTENT_TEST_ID);

    expect(content.hasAttribute('inert')).to.equal(true);

    await userEvent.click(screen.getByRole('button', {name: 'Toggle'}));

    expect(content.hasAttribute('inert')).to.equal(false);
  });

  it('should make a kept-mounted minHeight preview inert while collapsed', () => {
    render(
      <Collapse keepMounted disableAnimation>
        <CollapseControl>
          <button type='button'>{'Toggle'}</button>
        </CollapseControl>
        <CollapseContent minHeight={MIN_HEIGHT}>
          <button type='button'>{'Inside the preview'}</button>
        </CollapseContent>
      </Collapse>,
    );

    const content = screen.getByTestId(COLLAPSE_CONTENT_TEST_ID);

    // the preview stays painted, but nothing in the collapsed subtree may take focus
    expect(content.style.visibility).to.equal('');
    expect(content.hasAttribute('inert')).to.equal(true);
  });

  it('should not re-arm the hide fallback when duration is lowered mid-collapse', () => {
    vi.useFakeTimers();

    const ui = (duration: number, collapsed: boolean) => (
      <Collapse keepMounted duration={duration} collapsed={collapsed}>
        <CollapseControl>
          <button type='button'>{'Toggle'}</button>
        </CollapseControl>
        <CollapseContent>{textMock}</CollapseContent>
      </Collapse>
    );

    try {
      const {rerender} = render(ui(1000, false));
      const content = screen.getByTestId(COLLAPSE_CONTENT_TEST_ID);

      rerender(ui(1000, true));

      act(() => vi.advanceTimersByTime(300));

      // lowering duration must not replace the running collapse's fallback with a shorter one
      rerender(ui(0, true));

      act(() => vi.advanceTimersByTime(200));
      expect(content.style.visibility).to.equal('');

      act(() => vi.advanceTimersByTime(700));
      expect(content.style.visibility).to.equal('hidden');
    } finally {
      vi.useRealTimers();
    }
  });

  it('should protect server-rendered collapsed markup with visibility and inert', () => {
    const markup = renderToStaticMarkup(
      <Collapse keepMounted>
        <CollapseContent>
          <button type='button' style={{visibility: 'visible'}}>
            {'Escaping child'}
          </button>
        </CollapseContent>
      </Collapse>,
    );

    expect(markup).to.include('inert');
    expect(markup).to.include('visibility:hidden');
  });

  it('should keep the minHeight preview rendered when animation is disabled', () => {
    renderComponent(MIN_HEIGHT, true);

    const content = screen.getByTestId(COLLAPSE_CONTENT_TEST_ID);

    expect(content).to.contain.text(textMock);
    expect(content.style.visibility).to.equal('');
  });

  it('should keep kept-mounted content hidden when disableAnimation is turned off while collapsed', () => {
    const ui = (collapsed: boolean, disableAnimation: boolean) => (
      <Collapse keepMounted collapsed={collapsed} disableAnimation={disableAnimation}>
        <CollapseControl>
          <button type='button'>{'Toggle'}</button>
        </CollapseControl>
        <CollapseContent>{textMock}</CollapseContent>
      </Collapse>
    );

    const {rerender} = render(ui(false, true));
    const content = screen.getByTestId(COLLAPSE_CONTENT_TEST_ID);

    expect(content.style.visibility).to.equal('');

    rerender(ui(true, true));

    expect(content.style.visibility).to.equal('hidden');
    expect(content.hasAttribute('inert')).to.equal(true);

    rerender(ui(true, false));

    expect(content.style.visibility).to.equal('hidden');
    expect(content.hasAttribute('inert')).to.equal(true);
  });

  it('should be able to expand by default', () => {
    renderComponent(0, true, false, false);

    const content = screen.getByTestId(COLLAPSE_CONTENT_CONTAINER_TEST_ID);

    expect(content).to.contain.text(textMock);
  });
});

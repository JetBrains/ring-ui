/* eslint-disable @typescript-eslint/no-magic-numbers */

import {getByRole, getByTestId, queryByTestId, render, screen} from '@testing-library/react';

import {act} from 'react';

import userEvent from '@testing-library/user-event';

import {beforeEach} from 'vitest';

import simulateCombo from '../../test-helpers/simulate-combo';

import {QueryAssistSuggestion} from './query-assist__suggestions';

import QueryAssist, {QueryAssistAttrs, QueryAssistChange, QueryAssistRequestParams} from './query-assist';
import styles from './query-assist.css';

describe('Query Assist', () => {
  const testQuery = 'oooooooooooo';
  const testQueryLength = testQuery.length;

  const suggestions = [
    {
      prefix: 'login: ',
      option: 'test',
      suffix: ' ',
      description: 'logins',
      matchingStart: 0,
      matchingEnd: 4,
      caret: 2,
      completionStart: 0,
      completionEnd: 4,
      group: 'logins',
      icon: 'data:uri',
    },
    {
      prefix: 'login: ',
      option: 'test.1',
      suffix: ' ',
      description: 'logins',
      matchingStart: 0,
      matchingEnd: 4,
      caret: 2,
      completionStart: 0,
      completionEnd: 4,
      group: 'logins',
      icon: 'data:uri',
    },
    {
      prefix: 'login: ',
      option: 'test.2',
      suffix: ' ',
      description: 'logins',
      matchingStart: 0,
      matchingEnd: 4,
      caret: 2,
      completionStart: 0,
      completionEnd: 4,
      group: 'logins',
      icon: 'data:uri',
    },
    {
      prefix: 'login: ',
      option: 'test.3',
      suffix: ' ',
      description: 'logins',
      matchingStart: 0,
      matchingEnd: 4,
      caret: 2,
      completionStart: 0,
      completionEnd: 4,
      group: 'logins',
      icon: 'data:uri',
    },
  ];

  const dataSource = ({query, caret}: QueryAssistRequestParams) =>
    Promise.resolve({
      query,
      caret,
      suggestions,
    });

  const defaultProps = () => ({
    query: testQuery,
    focus: true,
    dataSource: sandbox.spy(dataSource),
  });
  const renderQueryAssist = (props?: Partial<QueryAssistAttrs>) => {
    render(<QueryAssist {...defaultProps()} {...props} />);
    return screen.getByTestId('ring-query-assist');
  };

  const waitForSetStateCallbacks = () => act(() => new Promise(resolve => setTimeout(resolve, 0)));

  beforeEach(waitForSetStateCallbacks);

  describe('props to state passing', () => {
    it('should create component', () => {
      const queryAssist = renderQueryAssist();

      queryAssist.should.exist;
      getByRole(queryAssist, 'textbox').should.exist;
    });

    it('should use initial props', () => {
      const queryAssist = renderQueryAssist();
      getByRole(queryAssist, 'textbox').should.have.text(testQuery);
      const placeholder = queryByTestId(queryAssist, 'query-assist-placeholder');
      should.not.exist(placeholder);
    });

    it('should handle props update', () => {
      const props = defaultProps();
      const {rerender} = render(<QueryAssist {...props} />);
      rerender(<QueryAssist {...props} query="update" caret={2} />);

      const queryAssist = screen.getByTestId('ring-query-assist');
      getByRole(queryAssist, 'textbox').should.have.text('update');
    });

    it('should not set undefined query on update', () => {
      const props = defaultProps();
      const {rerender} = render(<QueryAssist {...props} />);
      rerender(<QueryAssist {...props} query={undefined} />);

      const queryAssist = screen.getByTestId('ring-query-assist');
      getByRole(queryAssist, 'textbox').should.have.text(testQuery);
    });
  });

  describe('setFocus', () => {
    it('should set focus in query assist', () => {
      const props = defaultProps();
      const {rerender} = render(<QueryAssist {...props} focus={null} />);
      rerender(<QueryAssist {...props} focus />);

      const queryAssist = screen.getByTestId('ring-query-assist');
      getByRole(queryAssist, 'textbox').should.equal(document.activeElement);
    });

    it('should remove focus from query assist', () => {
      const props = defaultProps();
      const {rerender} = render(<QueryAssist {...props} focus />);
      rerender(<QueryAssist {...props} focus={false} />);

      const queryAssist = screen.getByTestId('ring-query-assist');
      getByRole(queryAssist, 'textbox').should.not.equal(document.activeElement);
    });
  });

  describe('shortcuts', () => {
    it('should enable shortcuts when we set focus', async () => {
      const onApply = vi.fn();
      const props = {...defaultProps(), onApply};
      const {rerender} = render(<QueryAssist {...props} focus={null} />);
      rerender(<QueryAssist {...props} focus />);

      await act(() => simulateCombo('enter'));
      expect(onApply).toHaveBeenCalled();
    });

    it('should disable shortcuts when we remove focus', async () => {
      const onApply = vi.fn();
      const props = {...defaultProps(), onApply};
      const {rerender} = render(<QueryAssist {...props} focus />);
      rerender(<QueryAssist {...props} focus={null} />);

      await act(() => {
        simulateCombo('enter');
      });
      expect(onApply).not.toHaveBeenCalled();
    });

    it('should not enable shortcuts after rerender', async () => {
      const onApply = vi.fn();
      const props = {...defaultProps(), onApply, focus: false};
      const {rerender} = render(<QueryAssist {...props} placeholder="bar" />);
      rerender(<QueryAssist {...props} placeholder="foo" />);

      await act(() => simulateCombo('enter'));
      expect(onApply).not.toHaveBeenCalled();
    });
  });

  describe('init', () => {
    it('should request data', async () => {
      const props = defaultProps();
      render(<QueryAssist {...props} />);
      props.dataSource.resetHistory();
      await act(() => simulateCombo('ctrl+space'));
      props.dataSource.should.have.been.calledOnce;
    });

    it('should request data debounced when delay set', async () => {
      vi.useFakeTimers();
      const props = {...defaultProps(), delay: 100};
      render(<QueryAssist {...props} />);
      props.dataSource.resetHistory();
      await act(() => simulateCombo('ctrl+space'));
      props.dataSource.should.not.have.been.called;
      await act(() => vi.runAllTimers());
      props.dataSource.should.have.been.calledOnce;
    });

    it('should create popup when autoOpen', async () => {
      await new Promise<void>(resolve => {
        renderQueryAssist({
          autoOpen: true,
          dataSource: params => {
            params.should.not.have.property('omitSuggestions');
            resolve();
            return dataSource(params);
          },
        });
      });
    });

    it('should not create popup by default', async () => {
      await new Promise<void>(resolve => {
        renderQueryAssist({
          dataSource: params => {
            params.should.have.property('omitSuggestions', true);
            resolve();
            return dataSource(params);
          },
        });
      });
    });
  });

  describe('rendering', () => {
    const LETTER_CLASS = styles.letter;

    it('should pass className', () => {
      const queryAssist = renderQueryAssist({className: 'test-class'});

      queryAssist.should.have.class('test-class');
    });

    it('should render letters', () => {
      const queryAssist = renderQueryAssist();

      queryAssist.should.contain(`.${LETTER_CLASS}`);
      queryAssist.querySelectorAll(`.${LETTER_CLASS}`).should.have.length(testQueryLength);
    });

    it('should support undo', async () => {
      const props = defaultProps();
      const {rerender} = render(<QueryAssist {...props} />);
      rerender(<QueryAssist {...props} query="newQuery" />);

      await waitForSetStateCallbacks();

      await act(() => simulateCombo('meta+z'));
      const queryAssist = screen.getByTestId('ring-query-assist');

      await waitForSetStateCallbacks();

      getByRole(queryAssist, 'textbox').should.have.text(testQuery);
    });

    it('should render nothing on empty query', () => {
      const queryAssist = renderQueryAssist({
        query: '',
      });
      const input = getByRole(queryAssist, 'textbox');
      input.textContent!.should.be.empty;
    });

    it('should render nothing on falsy query', () => {
      const queryAssist = renderQueryAssist({
        query: null,
      });
      const input = getByRole(queryAssist, 'textbox');
      input.textContent!.should.be.empty;
    });

    it('Shouldnt make duplicate requests for styleRanges on initiating if query is provided', () => {
      const props = defaultProps();
      const {rerender} = render(<QueryAssist {...props} />);

      //Emulate multiple rerender when rendering component with react-ng
      rerender(<QueryAssist {...props} />);
      rerender(<QueryAssist {...props} />);

      props.dataSource.should.have.been.calledOnce;
    });

    it('should render placeholder when enabled on empty query', () => {
      const queryAssist = renderQueryAssist({
        query: '',
        placeholder: 'plz',
      });
      const placeholder = getByTestId(queryAssist, 'query-assist-placeholder');
      placeholder.should.exist;
      placeholder.should.have.text('plz');
    });

    it('should not render placeholder when disabled on empty query', () => {
      const queryAssist = renderQueryAssist({
        query: '',
      });
      const placeholder = queryByTestId(queryAssist, 'query-assist-placeholder');
      should.not.exist(placeholder);
    });

    it('should render with colors', async () => {
      const queryAssist = renderQueryAssist({
        dataSource: ({query, caret}) =>
          Promise.resolve({
            query,
            caret,
            styleRanges: [
              {start: 0, length: 1, style: 'text'},
              {start: 1, length: 1, style: 'field_value'},
              {start: 2, length: 1, style: 'field_name'},
              {start: 3, length: 1, style: 'operator'},
            ],
          }),
      });

      await waitForSetStateCallbacks();
      const letters = queryAssist.querySelectorAll(`.${LETTER_CLASS}`);

      letters[0].should.have.class(styles['letter-text']);
      letters[1].should.have.class(styles['letter-field-value']);
      letters[2].should.have.class(styles['letter-field-name']);
      letters[3].should.have.class(styles['letter-operator']);
    });

    it('should render last text range with default style when applied', async () => {
      const queryAssist = renderQueryAssist({
        query: 'a ',
        dataSource: ({query, caret}) =>
          Promise.resolve({
            query,
            caret,
            styleRanges: [
              {start: 0, length: 1, style: 'text'},
              {start: 2, length: 1, style: 'text'},
            ],
          }),
      });

      const input = getByRole(queryAssist, 'textbox');
      const user = userEvent.setup();
      await user.type(input, 'a');

      const letters = queryAssist.querySelectorAll(`.${LETTER_CLASS}`);

      letters[0].should.have.class(styles['letter-text']);
      letters[1].should.have.class(styles.letterDefault);
      letters[2].should.have.class(styles.letterDefault);
    });

    it('should render last text range with text style when applied', async () => {
      const queryAssist = renderQueryAssist({
        query: 'a a',
        dataSource: ({query, caret}) =>
          Promise.resolve({
            query,
            caret,
            styleRanges: [
              {start: 0, length: 1, style: 'text'},
              {start: 2, length: 1, style: 'text'},
            ],
          }),
      });

      await waitForSetStateCallbacks();
      const letters = queryAssist.querySelectorAll(`.${LETTER_CLASS}`);

      letters[0].should.have.class(styles['letter-text']);
      letters[1].should.have.class(styles.letterDefault);
      letters[2].should.have.class(styles['letter-text']);
    });

    it('should disable field when component disabled', () => {
      const queryAssist = renderQueryAssist({
        disabled: true,
      });
      const input = getByRole(queryAssist, 'textbox');
      input.should.have.attr('contenteditable', 'false');
    });

    it('should render glass when enabled', () => {
      const queryAssist = renderQueryAssist({
        glass: true,
      });

      const glass = getByTestId(queryAssist, 'query-assist-search-icon');
      glass.should.exist;
    });

    it('should not render glass when disabled', () => {
      const queryAssist = renderQueryAssist({
        glass: false,
      });

      const glass = queryByTestId(queryAssist, 'query-assist-search-icon');
      should.not.exist(glass);
    });

    it('should render clear when enabled', () => {
      const queryAssist = renderQueryAssist({
        clear: true,
      });

      const clear = getByTestId(queryAssist, 'query-assist-clear-icon');
      clear.should.exist;
    });

    it('should not render clear when disabled', () => {
      const queryAssist = renderQueryAssist({
        clear: false,
      });

      const clear = queryByTestId(queryAssist, 'query-assist-clear-icon');
      should.not.exist(clear);
    });

    it('should not render clear when query is empty', () => {
      const queryAssist = renderQueryAssist({
        clear: true,
        query: '',
      });

      const clear = queryByTestId(queryAssist, 'query-assist-clear-icon');
      should.not.exist(clear);
    });

    it('should show loader on long request', async () => {
      vi.useFakeTimers();
      const queryAssist = renderQueryAssist({
        dataSource: () => new Promise(() => {}),
      });

      await act(() => vi.runAllTimers());
      const loader = getByTestId(queryAssist, 'ring-loader-inline');
      loader.should.exist;
    });
  });

  describe('suggestions', () => {
    beforeEach(() =>
      vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      }),
    );

    it('should not show popup when no suggestions provided', async () => {
      renderQueryAssist({
        dataSource: ({query, caret}) =>
          Promise.resolve({
            query,
            caret,
            suggestions: [],
          }),
      });

      await act(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      const popup = screen.getByTestId('ring-popup ring-query-assist-popup');
      popup.should.have.attr('data-test-shown', 'false');
    });

    it('should show popup when suggestions provided', async () => {
      renderQueryAssist();

      await act(() => {
        simulateCombo('ctrl+space');
      });
      await waitForSetStateCallbacks();
      const popup = screen.getByTestId('ring-popup ring-query-assist-popup');
      popup.should.have.attr('data-test-shown', 'true');
      const list = getByTestId(popup, 'ring-list');
      list.should.exist;
    });

    it('should close popup with after zero suggestions provided', async () => {
      let currentSuggestions = suggestions;
      renderQueryAssist({
        dataSource: ({query, caret}) =>
          Promise.resolve({
            query,
            caret,
            suggestions: currentSuggestions,
          }),
      });

      currentSuggestions = [];
      await act(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      const popup = screen.getByTestId('ring-popup ring-query-assist-popup');
      popup.should.have.attr('data-test-shown', 'false');
    });

    it('should show popup with proper suggestions', async () => {
      renderQueryAssist({});

      const TWICE = 2;

      await act(() => {
        simulateCombo('ctrl+space');
      });
      await waitForSetStateCallbacks();
      const popup = screen.getByTestId('ring-popup ring-query-assist-popup');
      const list = getByTestId(popup, 'ring-list');

      const {length} = suggestions;

      list!.querySelectorAll('[data-test~=ring-list-item]').should.have.length(length);
      list!.querySelectorAll(`.${styles.highlight}`).should.have.length(length);
      list!.querySelectorAll(`.${styles.service}`).should.have.length(length * TWICE);
    });
  });

  describe('completion', () => {
    const completeQuery = 'test';
    const middleCaret = completeQuery.length / 2;

    function getSuggestionText({prefix, option, suffix}: QueryAssistSuggestion) {
      return (prefix + option + suffix).replace(/\s/g, '\u00a0');
    }

    it('should complete by tab in the end of phrase', async () => {
      const queryAssist = renderQueryAssist({
        query: completeQuery,
      });
      await act(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      await act(() => simulateCombo('tab'));

      const input = getByRole(queryAssist, 'textbox');
      input.should.have.text(getSuggestionText(suggestions[0]));
    });

    it('should complete selected suggestion by enter in the end of phrase', async () => {
      const queryAssist = renderQueryAssist({
        query: completeQuery,
      });
      await act(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      await act(() => simulateCombo('down'));
      await act(() => simulateCombo('enter'));

      const input = getByRole(queryAssist, 'textbox');
      input.should.have.text(getSuggestionText(suggestions[0]));
    });

    it('should complete by tab in the middle of phrase', async () => {
      const queryAssist = renderQueryAssist({
        query: completeQuery,
        caret: middleCaret,
      });
      await act(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      await act(() => simulateCombo('tab'));

      const input = getByRole(queryAssist, 'textbox');
      input.should.have.text(getSuggestionText(suggestions[0]));
    });

    it('should complete selected suggestion by enter in the middle of phrase', async () => {
      const queryAssist = renderQueryAssist({
        query: completeQuery,
        caret: middleCaret,
      });
      await act(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      await act(() => simulateCombo('down'));
      await act(() => simulateCombo('enter'));

      const input = getByRole(queryAssist, 'textbox');
      input.should.have.text(getSuggestionText(suggestions[0]) + completeQuery.substring(middleCaret));
    });

    it('should complete selected suggestion by tab in the middle of phrase', async () => {
      const queryAssist = renderQueryAssist({
        query: completeQuery,
        caret: middleCaret,
      });
      await act(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      await act(() => simulateCombo('down'));
      await act(() => simulateCombo('down'));
      await act(() => simulateCombo('down'));
      await act(() => simulateCombo('tab'));

      const input = getByRole(queryAssist, 'textbox');
      input.should.have.text(getSuggestionText(suggestions[2]));
    });

    it('should undo last applied completion', async () => {
      const queryAssist = renderQueryAssist({
        query: completeQuery,
        caret: middleCaret,
      });
      await act(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      await act(() => simulateCombo('down'));
      await act(() => simulateCombo('down'));
      await act(() => simulateCombo('down'));
      await act(() => simulateCombo('tab'));

      const input = getByRole(queryAssist, 'textbox');
      input.should.not.have.text(completeQuery);
      await act(() => simulateCombo('meta+z'));
      input.should.have.text(completeQuery);
    });
  });

  describe('callbacks', () => {
    let onApply: (change: QueryAssistChange) => void;
    beforeEach(() => {
      onApply = sandbox.stub();
    });

    it('should call onApply', async () => {
      renderQueryAssist({
        onApply,
      });

      await act(() => simulateCombo('enter'));
      onApply.should.have.been.calledWithMatch({
        query: testQuery,
        caret: testQueryLength,
      });
    });

    it('should call onApply when press ctrl/cmd + enter', async () => {
      renderQueryAssist({
        onApply,
      });

      await act(() => simulateCombo('ctrl+enter'));
      onApply.should.have.been.calledWithMatch({
        query: testQuery,
        caret: testQueryLength,
      });
    });

    it('should call onClear', async () => {
      const onClear = sandbox.stub();
      const queryAssist = renderQueryAssist({
        clear: true,
        onClear,
      });
      const clear = getByTestId(queryAssist, 'query-assist-clear-icon');
      const user = userEvent.setup();
      await user.click(clear);
      onClear.should.have.been.calledWithExactly();
    });
  });

  describe('request data', () => {
    it('should batch requests', async () => {
      vi.useFakeTimers();

      const props = defaultProps();
      const {rerender} = render(<QueryAssist {...props} />);
      rerender(<QueryAssist {...props} delay={100} />);
      props.dataSource.resetHistory();
      await act(() => simulateCombo('ctrl+space'));
      await act(() => simulateCombo('ctrl+space'));
      await act(() => simulateCombo('ctrl+space'));
      await act(() => vi.runAllTimers());

      props.dataSource.should.have.been.calledOnce;
    });
  });

  describe('custom actions', () => {
    it('should allow to pass custom actions', () => {
      const queryAssist = renderQueryAssist({
        actions: [<div id={'A'} key={'A'} />, <div id={'B'} key={'B'} />],
      });

      queryAssist.querySelector('#A')!.should.exist;
      queryAssist.querySelector('#B')!.should.exist;
    });
  });
});

import {getByRole, getByTestId, queryByTestId, render, screen} from '@testing-library/react';
import {act} from 'react';
import userEvent from '@testing-library/user-event';
import {beforeEach} from 'vitest';

import simulateCombo from '../../test-helpers/simulate-combo';
import {type QueryAssistSuggestion} from './query-assist-suggestions';
import QueryAssist, {
  type QueryAssistAttrs,
  type QueryAssistChange,
  type QueryAssistRequestParams,
} from './query-assist';

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
    dataSource: vi.fn().mockImplementation(dataSource),
  });
  const renderQueryAssist = (props?: Partial<QueryAssistAttrs>) => {
    render(<QueryAssist {...defaultProps()} {...props} />);
    return screen.getByTestId('ring-query-assist');
  };

  const waitForSetStateCallbacks = (callback?: () => void) =>
    act(async () => {
      await callback?.();
      return new Promise(resolve => setTimeout(resolve, 0));
    });

  beforeEach(() => waitForSetStateCallbacks());

  describe('props to state passing', () => {
    it('should create component', async () => {
      const queryAssist = renderQueryAssist();
      await waitForSetStateCallbacks();

      expect(queryAssist).to.exist;
      expect(getByRole(queryAssist, 'textbox')).to.exist;
    });

    it('should use initial props', async () => {
      const queryAssist = renderQueryAssist();
      await waitForSetStateCallbacks();
      expect(getByRole(queryAssist, 'textbox')).to.have.text(testQuery);
      const placeholder = queryByTestId(queryAssist, 'query-assist-placeholder');
      expect(placeholder).to.not.exist;
    });

    it('should handle props update', async () => {
      const props = defaultProps();
      const {rerender} = render(<QueryAssist {...props} />);
      rerender(<QueryAssist {...props} query='update' caret={2} />);
      await waitForSetStateCallbacks();

      const queryAssist = screen.getByTestId('ring-query-assist');
      expect(getByRole(queryAssist, 'textbox')).to.have.text('update');
    });

    it('should not set undefined query on update', async () => {
      const props = defaultProps();
      const {rerender} = render(<QueryAssist {...props} />);
      rerender(<QueryAssist {...props} query={undefined} />);
      await waitForSetStateCallbacks();

      const queryAssist = screen.getByTestId('ring-query-assist');
      expect(getByRole(queryAssist, 'textbox')).to.have.text(testQuery);
    });
  });

  describe('setFocus', () => {
    it('should set focus in query assist', async () => {
      const props = defaultProps();
      const {rerender} = render(<QueryAssist {...props} focus={null} />);
      rerender(<QueryAssist {...props} focus />);
      await waitForSetStateCallbacks();

      const queryAssist = screen.getByTestId('ring-query-assist');
      expect(getByRole(queryAssist, 'textbox')).to.equal(document.activeElement);
    });

    it('should remove focus from query assist', async () => {
      const props = defaultProps();
      const {rerender} = render(<QueryAssist {...props} focus />);
      rerender(<QueryAssist {...props} focus={false} />);
      await waitForSetStateCallbacks();

      const queryAssist = screen.getByTestId('ring-query-assist');
      expect(getByRole(queryAssist, 'textbox')).to.not.equal(document.activeElement);
    });
  });

  describe('shortcuts', () => {
    it('should enable shortcuts when we set focus', async () => {
      const onApply = vi.fn();
      const props = {...defaultProps(), onApply};
      const {rerender} = render(<QueryAssist {...props} focus={null} />);
      rerender(<QueryAssist {...props} focus />);
      await waitForSetStateCallbacks();

      await act(() => simulateCombo('enter'));
      expect(onApply).toHaveBeenCalled();
    });

    it('should disable shortcuts when we remove focus', async () => {
      const onApply = vi.fn();
      const props = {...defaultProps(), onApply};
      const {rerender} = render(<QueryAssist {...props} focus />);
      rerender(<QueryAssist {...props} focus={null} />);
      await waitForSetStateCallbacks();

      await act(() => {
        simulateCombo('enter');
      });
      expect(onApply).not.toHaveBeenCalled();
    });

    it('should not enable shortcuts after rerender', async () => {
      const onApply = vi.fn();
      const props = {...defaultProps(), onApply, focus: false};
      const {rerender} = render(<QueryAssist {...props} placeholder='bar' />);
      rerender(<QueryAssist {...props} placeholder='foo' />);
      await waitForSetStateCallbacks();

      await act(() => simulateCombo('enter'));
      expect(onApply).not.toHaveBeenCalled();
    });
  });

  describe('init', () => {
    it('should request data', async () => {
      const props = defaultProps();
      render(<QueryAssist {...props} />);
      props.dataSource.mockClear();
      await waitForSetStateCallbacks(() => simulateCombo('ctrl+space'));
      expect(props.dataSource).toHaveBeenCalledOnce;
    });

    it('should request data debounced when delay set', async () => {
      const props = {...defaultProps(), delay: 100};
      render(<QueryAssist {...props} />);
      props.dataSource.mockClear();
      await waitForSetStateCallbacks();
      vi.useFakeTimers();
      await act(() => simulateCombo('ctrl+space'));
      expect(props.dataSource).not.toHaveBeenCalled;
      await waitForSetStateCallbacks(() => {
        vi.runAllTimers();
        vi.useRealTimers();
      });
      expect(props.dataSource).toHaveBeenCalledOnce;
    });

    it('should create popup when autoOpen', async () => {
      await new Promise<void>(resolve => {
        renderQueryAssist({
          autoOpen: true,
          dataSource: params =>
            act(() => {
              expect(params).to.not.have.property('omitSuggestions');
              resolve();
              return dataSource(params);
            }),
        });
      });
    });

    it('should not create popup by default', async () => {
      await new Promise<void>(resolve => {
        renderQueryAssist({
          dataSource: params =>
            act(() => {
              expect(params).to.have.property('omitSuggestions', true);
              resolve();
              return dataSource(params);
            }),
        });
      });
    });
  });

  describe('rendering', () => {
    const LETTER_CLASS = styles.letter;

    it('should pass className', async () => {
      const queryAssist = renderQueryAssist({className: 'test-class'});
      await waitForSetStateCallbacks();

      expect(queryAssist).to.have.class('test-class');
    });

    it('should render letters', async () => {
      const queryAssist = renderQueryAssist();
      await waitForSetStateCallbacks();

      expect(queryAssist).to.contain(`.${LETTER_CLASS}`);
      expect(queryAssist.querySelectorAll(`.${LETTER_CLASS}`)).to.have.length(testQueryLength);
    });

    it('should support undo', async () => {
      const props = defaultProps();
      const {rerender} = render(<QueryAssist {...props} />);
      rerender(<QueryAssist {...props} query='newQuery' />);

      await waitForSetStateCallbacks();

      await waitForSetStateCallbacks(() => simulateCombo('meta+z'));
      const queryAssist = screen.getByTestId('ring-query-assist');

      await waitForSetStateCallbacks();

      expect(getByRole(queryAssist, 'textbox')).to.have.text(testQuery);
    });

    it('should render nothing on empty query', async () => {
      const queryAssist = renderQueryAssist({
        query: '',
      });
      await waitForSetStateCallbacks();
      const input = getByRole(queryAssist, 'textbox');
      expect(input.textContent!).to.be.empty;
    });

    it('should render nothing on falsy query', async () => {
      const queryAssist = renderQueryAssist({
        query: null,
      });
      await waitForSetStateCallbacks();
      const input = getByRole(queryAssist, 'textbox');
      expect(input.textContent!).to.be.empty;
    });

    it('Shouldnt make duplicate requests for styleRanges on initiating if query is provided', async () => {
      const props = defaultProps();
      const {rerender} = render(<QueryAssist {...props} />);

      //Emulate multiple rerender when rendering component with react-ng
      rerender(<QueryAssist {...props} />);
      rerender(<QueryAssist {...props} />);
      await waitForSetStateCallbacks();

      expect(props.dataSource).toHaveBeenCalledOnce;
    });

    it('should render placeholder when enabled on empty query', async () => {
      const queryAssist = renderQueryAssist({
        query: '',
        placeholder: 'plz',
      });
      await waitForSetStateCallbacks();
      const placeholder = getByTestId(queryAssist, 'query-assist-placeholder');
      expect(placeholder).to.exist;
      expect(placeholder).to.have.text('plz');
    });

    it('should not render placeholder when disabled on empty query', async () => {
      const queryAssist = renderQueryAssist({
        query: '',
      });
      await waitForSetStateCallbacks();
      const placeholder = queryByTestId(queryAssist, 'query-assist-placeholder');
      expect(placeholder).to.not.exist;
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

      expect(letters[0]).to.have.class(styles['letter-text']);
      expect(letters[1]).to.have.class(styles['letter-field-value']);
      expect(letters[2]).to.have.class(styles['letter-field-name']);
      expect(letters[3]).to.have.class(styles['letter-operator']);
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

      expect(letters[0]).to.have.class(styles['letter-text']);
      expect(letters[1]).to.have.class(styles.letterDefault);
      expect(letters[2]).to.have.class(styles.letterDefault);
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

      expect(letters[0]).to.have.class(styles['letter-text']);
      expect(letters[1]).to.have.class(styles.letterDefault);
      expect(letters[2]).to.have.class(styles['letter-text']);
    });

    it('should disable field when component disabled', async () => {
      const queryAssist = renderQueryAssist({
        disabled: true,
      });
      await waitForSetStateCallbacks();
      const input = getByRole(queryAssist, 'textbox');
      expect(input).to.have.attr('contenteditable', 'false');
    });

    it('should render glass when enabled', async () => {
      const queryAssist = renderQueryAssist({
        glass: true,
      });
      await waitForSetStateCallbacks();

      const glass = getByTestId(queryAssist, 'query-assist-search-icon');
      expect(glass).to.exist;
    });

    it('should not render glass when disabled', async () => {
      const queryAssist = renderQueryAssist({
        glass: false,
      });
      await waitForSetStateCallbacks();

      const glass = queryByTestId(queryAssist, 'query-assist-search-icon');
      expect(glass).to.not.exist;
    });

    it('should render clear when enabled', async () => {
      const queryAssist = renderQueryAssist({
        clear: true,
      });
      await waitForSetStateCallbacks();

      const clear = getByTestId(queryAssist, 'query-assist-clear-icon');
      expect(clear).to.exist;
    });

    it('should not render clear when disabled', async () => {
      const queryAssist = renderQueryAssist({
        clear: false,
      });
      await waitForSetStateCallbacks();

      const clear = queryByTestId(queryAssist, 'query-assist-clear-icon');
      expect(clear).to.not.exist;
    });

    it('should not render clear when query is empty', async () => {
      const queryAssist = renderQueryAssist({
        clear: true,
        query: '',
      });
      await waitForSetStateCallbacks();

      const clear = queryByTestId(queryAssist, 'query-assist-clear-icon');
      expect(clear).to.not.exist;
    });

    it('should show loader on long request', async () => {
      vi.useFakeTimers();
      const queryAssist = renderQueryAssist({
        dataSource: () => new Promise(() => {}),
      });

      await act(() => vi.runAllTimers());
      const loader = getByTestId(queryAssist, 'ring-loader-inline');
      expect(loader).to.exist;
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

      await waitForSetStateCallbacks(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      const popup = screen.getByTestId('ring-popup ring-query-assist-popup');
      expect(popup).to.have.attr('data-test-shown', 'false');
    });

    it('should show popup when suggestions provided', async () => {
      renderQueryAssist();

      await waitForSetStateCallbacks(() => {
        simulateCombo('ctrl+space');
      });
      await waitForSetStateCallbacks();
      const popup = screen.getByTestId('ring-popup ring-query-assist-popup');
      expect(popup).to.have.attr('data-test-shown', 'true');
      const list = getByTestId(popup, 'ring-list');
      expect(list).to.exist;
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
      await waitForSetStateCallbacks(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      const popup = screen.getByTestId('ring-popup ring-query-assist-popup');
      expect(popup).to.have.attr('data-test-shown', 'false');
    });

    it('should show popup with proper suggestions', async () => {
      renderQueryAssist({});

      const TWICE = 2;

      await waitForSetStateCallbacks(() => {
        simulateCombo('ctrl+space');
      });
      await waitForSetStateCallbacks();
      const popup = screen.getByTestId('ring-popup ring-query-assist-popup');
      const list = getByTestId(popup, 'ring-list');

      const {length} = suggestions;

      expect(list!.querySelectorAll('[data-test~=ring-list-item]')).to.have.length(length);
      expect(list!.querySelectorAll(`.${styles.highlight}`)).to.have.length(length);
      expect(list!.querySelectorAll(`.${styles.service}`)).to.have.length(length * TWICE);
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
      await waitForSetStateCallbacks(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      await waitForSetStateCallbacks(() => simulateCombo('tab'));

      const input = getByRole(queryAssist, 'textbox');
      expect(input).to.have.text(getSuggestionText(suggestions[0]));
    });

    it('should complete selected suggestion by enter in the end of phrase', async () => {
      const queryAssist = renderQueryAssist({
        query: completeQuery,
      });
      await waitForSetStateCallbacks(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      await waitForSetStateCallbacks(() => simulateCombo('down'));
      await waitForSetStateCallbacks(() => simulateCombo('enter'));

      const input = getByRole(queryAssist, 'textbox');
      expect(input).to.have.text(getSuggestionText(suggestions[0]));
    });

    it('should complete by tab in the middle of phrase', async () => {
      const queryAssist = renderQueryAssist({
        query: completeQuery,
        caret: middleCaret,
      });
      await waitForSetStateCallbacks(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      await waitForSetStateCallbacks(() => simulateCombo('tab'));

      const input = getByRole(queryAssist, 'textbox');
      expect(input).to.have.text(getSuggestionText(suggestions[0]));
    });

    it('should complete selected suggestion by enter in the middle of phrase', async () => {
      const queryAssist = renderQueryAssist({
        query: completeQuery,
        caret: middleCaret,
      });
      await waitForSetStateCallbacks(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      await waitForSetStateCallbacks(() => simulateCombo('down'));
      await waitForSetStateCallbacks(() => simulateCombo('enter'));

      const input = getByRole(queryAssist, 'textbox');
      expect(input).to.have.text(getSuggestionText(suggestions[0]) + completeQuery.substring(middleCaret));
    });

    it('should complete selected suggestion by tab in the middle of phrase', async () => {
      const queryAssist = renderQueryAssist({
        query: completeQuery,
        caret: middleCaret,
      });
      await waitForSetStateCallbacks(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      await waitForSetStateCallbacks(() => simulateCombo('down'));
      await waitForSetStateCallbacks(() => simulateCombo('down'));
      await waitForSetStateCallbacks(() => simulateCombo('down'));
      await waitForSetStateCallbacks(() => simulateCombo('tab'));

      const input = getByRole(queryAssist, 'textbox');
      expect(input).to.have.text(getSuggestionText(suggestions[2]));
    });

    it('should undo last applied completion', async () => {
      const queryAssist = renderQueryAssist({
        query: completeQuery,
        caret: middleCaret,
      });
      await waitForSetStateCallbacks(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks();
      await waitForSetStateCallbacks(() => simulateCombo('down'));
      await waitForSetStateCallbacks(() => simulateCombo('down'));
      await waitForSetStateCallbacks(() => simulateCombo('down'));
      await waitForSetStateCallbacks(() => simulateCombo('tab'));

      const input = getByRole(queryAssist, 'textbox');
      expect(input).to.not.have.text(completeQuery);
      await waitForSetStateCallbacks(() => simulateCombo('meta+z'));
      expect(input).to.have.text(completeQuery);
    });
  });

  describe('callbacks', () => {
    let onApply: (change: QueryAssistChange) => void;
    beforeEach(() => {
      onApply = vi.fn();
    });

    it('should call onApply', async () => {
      renderQueryAssist({
        onApply,
      });

      await waitForSetStateCallbacks();
      await act(() => simulateCombo('enter'));
      expect(onApply).toHaveBeenCalledWith(
        expect.objectContaining({
          query: testQuery,
          caret: testQueryLength,
        }),
      );
    });

    it('should call onApply when press ctrl/cmd + enter', async () => {
      renderQueryAssist({
        onApply,
      });

      await waitForSetStateCallbacks();
      await act(() => simulateCombo('ctrl+enter'));
      expect(onApply).toHaveBeenCalledWith(
        expect.objectContaining({
          query: testQuery,
          caret: testQueryLength,
        }),
      );
    });

    it('should call onClear', async () => {
      const onClear = vi.fn();
      const queryAssist = renderQueryAssist({
        clear: true,
        onClear,
      });
      const clear = getByTestId(queryAssist, 'query-assist-clear-icon');
      const user = userEvent.setup();
      await user.click(clear);
      expect(onClear).toHaveBeenCalledWith();
    });
  });

  describe('request data', () => {
    it('should batch requests', async () => {
      const props = defaultProps();
      const {rerender} = render(<QueryAssist {...props} />);
      rerender(<QueryAssist {...props} delay={100} />);
      props.dataSource.mockClear();
      await waitForSetStateCallbacks();
      vi.useFakeTimers();
      await act(() => simulateCombo('ctrl+space'));
      await act(() => simulateCombo('ctrl+space'));
      await act(() => simulateCombo('ctrl+space'));
      await waitForSetStateCallbacks(() => {
        vi.runAllTimers();
        vi.useRealTimers();
      });

      expect(props.dataSource).toHaveBeenCalledOnce;
    });
  });

  describe('custom actions', () => {
    it('should allow to pass custom actions', async () => {
      const queryAssist = renderQueryAssist({
        actions: [<div id={'A'} key={'A'} />, <div id={'B'} key={'B'} />],
      });

      await waitForSetStateCallbacks();
      expect(queryAssist.querySelector('#A')!).to.exist;
      expect(queryAssist.querySelector('#B')!).to.exist;
    });
  });
});

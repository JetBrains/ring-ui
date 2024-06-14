/* eslint-disable @typescript-eslint/no-magic-numbers */

import {Simulate} from 'react-dom/test-utils';
import {mount, MountRendererProps} from 'enzyme';


import simulateCombo from '../../test-helpers/simulate-combo';

import {QueryAssistSuggestion} from './query-assist__suggestions';

import QueryAssist, {
  QueryAssistAttrs,
  QueryAssistChange,
  QueryAssistRequestParams
} from './query-assist';
import styles from './query-assist.css';


describe('Query Assist', () => {
  const testQuery = 'oooooooooooo';
  const testQueryLength = testQuery.length;

  const suggestions = [{
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
    icon: 'data:uri'
  }, {
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
    icon: 'data:uri'
  }, {
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
    icon: 'data:uri'
  }, {
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
    icon: 'data:uri'
  }];

  const dataSource = ({query, caret}: QueryAssistRequestParams) => ({
    query,
    caret,
    suggestions
  });

  const defaultProps = () => ({
    query: testQuery,
    focus: true,
    dataSource: sandbox.spy(dataSource)
  });
  const mountQueryAssist = (props?: Partial<QueryAssistAttrs>, options?: MountRendererProps) =>
    mount(<QueryAssist {...defaultProps()} {...props}/>, options);

  describe('props to state passing', () => {
    it('should create component', () => {
      const wrapper = mountQueryAssist();

      wrapper.should.exist;
      wrapper.find<QueryAssist>(QueryAssist).instance().input!.should.exist;
    });

    it('should set state props to state on init', () => {
      const wrapper = mountQueryAssist();
      wrapper.find('QueryAssist').should.have.state('query', testQuery);
      wrapper.find('QueryAssist').should.have.state('placeholderEnabled', false);
    });

    it('should not set other props to state on init', () => {
      const wrapper = mountQueryAssist();

      wrapper.find('QueryAssist').should.not.have.state('popupClassName');
      wrapper.find('QueryAssist').should.not.have.state('dataSource');
      wrapper.find('QueryAssist').should.not.have.state('disabled');
      wrapper.find('QueryAssist').should.not.have.state('clear');
      wrapper.find('QueryAssist').should.not.have.state('hint');
      wrapper.find('QueryAssist').should.not.have.state('hintOnSelection');
      wrapper.find('QueryAssist').should.not.have.state('glass');
      wrapper.find('QueryAssist').should.not.have.state('placeholder');
      wrapper.find('QueryAssist').should.not.have.state('onApply');
      wrapper.find('QueryAssist').should.not.have.state('onChange');
      wrapper.find('QueryAssist').should.not.have.state('onClear');
      wrapper.find('QueryAssist').should.not.have.state('onFocusChange');
    });

    it('should set state props to state on update', () => {
      const wrapper = mountQueryAssist({
        query: 'update',
        caret: 2,
        focus: false
      });

      wrapper.find('QueryAssist').should.have.state('query', 'update');
    });

    it('should set state props to immediateState on update', () => {
      const instance = mountQueryAssist({
        query: 'update',
        caret: 2,
        focus: false
      }).find<QueryAssist>(QueryAssist).instance();

      instance.immediateState.query.should.equal('update');
      instance.immediateState.caret.should.equal(2);
      instance.immediateState.focus!.should.equal(false);
    });

    it('should not set undefined state props to state on update', () => {
      const wrapper = mountQueryAssist();

      wrapper.setProps({
        query: undefined
      });

      wrapper.find('QueryAssist').should.have.state('query', testQuery);
    });

    it('should not set caret with query on update', () => {
      const wrapper = mountQueryAssist();
      const instance = wrapper.find<QueryAssist>(QueryAssist).instance();

      wrapper.setProps({
        query: 'update'
      });

      wrapper.find('QueryAssist').should.have.state('query', 'update');
      instance.immediateState.query.should.equal('update');
      instance.immediateState.caret.should.equal(testQueryLength);
    });
  });


  describe('setFocus', () => {
    it('should set focus in query assist', () => {
      const instance = mountQueryAssist({focus: null}).find<QueryAssist>(QueryAssist).instance();

      instance.setFocus(true);

      instance.immediateState.focus!.should.equal(true);
    });

    it('should remove focus from query assist', () => {
      const instance = mountQueryAssist({focus: true}).find<QueryAssist>(QueryAssist).instance();

      instance.setFocus(false);

      instance.immediateState.focus!.should.equal(false);
    });
  });


  describe('shortcuts', () => {
    it('should enable shortcuts when we set focus', () => {
      const instance = mountQueryAssist({focus: null}).find<QueryAssist>(QueryAssist).instance();
      instance.state.shortcuts!.should.equal(false);

      instance.setFocus(true);
      instance.state.shortcuts!.should.equal(true);
    });


    it('should disable shortcuts when we remove focus', () => {
      const instance = mountQueryAssist({focus: true}).find<QueryAssist>(QueryAssist).instance();
      instance.state.shortcuts!.should.equal(true);

      instance.setFocus(false);
      instance.state.shortcuts!.should.equal(false);
    });


    it('should not enable shortcuts after rerender', () => {
      const wrapper = mountQueryAssist({focus: false, placeholder: 'bar'});
      const instance = wrapper.find<QueryAssist>(QueryAssist).instance();
      instance.state.shortcuts!.should.equal(false);

      wrapper.setProps({placeholder: 'foo'});
      instance.state.shortcuts!.should.equal(false);
    });
  });


  describe('init', () => {
    it('requestData should exist', () => {
      const instance = mountQueryAssist().find<QueryAssist>(QueryAssist).instance();
      instance.requestData!.should.be.a('function');
      instance.requestData!.should.equal(instance.requestHandler);
    });

    it('requestData should be debounced when delay set', () => {
      const instance = mountQueryAssist({
        delay: 0
      }).find<QueryAssist>(QueryAssist).instance();
      instance.requestData!.should.be.a('function');
      instance.requestData!.should.not.equal(instance.requestHandler);
    });


    it('should create popup when autoOpen', async () => {
      await new Promise<void>(resolve => {
        mountQueryAssist({
          autoOpen: true,
          dataSource: params => {
            params.should.not.have.property('omitSuggestions');
            resolve();
            return dataSource(params);
          }
        });
      });
    });

    it('should not create popup by default', async () => {
      await new Promise<void>(resolve => {
        mountQueryAssist({
          dataSource: params => {
            params.should.have.property('omitSuggestions', true);
            resolve();
            return dataSource(params);
          }
        });
      });
    });
  });

  describe('rendering', () => {
    const LETTER_CLASS = styles.letter;

    it('should pass className', () => {
      const instance = mountQueryAssist({className: 'test-class'}).find<QueryAssist>(
        QueryAssist).instance();

      instance.node!.className.should.contain('test-class');
    });

    it('should render letters', () => {
      const instance = mountQueryAssist().find<QueryAssist>(QueryAssist).instance();

      instance.input!.should.contain(`.${LETTER_CLASS}`);
      instance.input!.querySelectorAll(`.${LETTER_CLASS}`).
        should.have.length(testQueryLength);
    });

    it('should support undo', async () => {
      const instance = mountQueryAssist().find<QueryAssist>(QueryAssist).instance();

      await new Promise<void>(resolve => {
        instance.setState({query: 'newQuery'}, () => {
          simulateCombo('meta+z');

          setTimeout(() => {
            instance.state.query!.should.equal(testQuery);
            resolve();
          });
        });
      });
    });


    it('should render nothing on empty query', () => {
      const instance = mountQueryAssist({
        query: ''
      }).find<QueryAssist>(QueryAssist).instance();

      instance.input!.textContent!.should.be.empty;
    });

    it('should render nothing on falsy query', () => {
      const instance = mountQueryAssist({
        query: null
      }).find<QueryAssist>(QueryAssist).instance();

      instance.input!.textContent!.should.be.empty;
    });

    it('Shouldnt make duplicate requests for styleRanges on initiating if query is provided', () => {
      const wrapper = mountQueryAssist();

      //Emulate multiple rerender when rendering component with react-ng
      wrapper.setProps({});
      wrapper.setProps({});

      wrapper.prop('dataSource').should.have.been.calledOnce;
    });

    it('should render placeholder when enabled on empty query', () => {
      const instance = mountQueryAssist({
        query: '',
        placeholder: 'plz'
      }).find<QueryAssist>(QueryAssist).instance();

      instance.placeholder!.should.exist;
      instance.placeholder!.should.have.text('plz');
    });

    it('should not render placeholder when disabled on empty query', () => {
      const instance = mountQueryAssist({
        query: ''
      }).find<QueryAssist>(QueryAssist).instance();

      should.not.exist(instance.placeholder);
    });

    it('should render with colors', () => {
      const wrapper = mountQueryAssist();

      wrapper.find('QueryAssist').setState({
        styleRanges: [
          {start: 0, length: 1, style: 'text'},
          {start: 1, length: 1, style: 'field_value'},
          {start: 2, length: 1, style: 'field_name'},
          {start: 3, length: 1, style: 'operator'}
        ]
      });

      const letters = wrapper.find<QueryAssist>(QueryAssist).instance().input!.querySelectorAll(`.${LETTER_CLASS}`);

      letters[0].should.have.class(styles['letter-text']);
      letters[1].should.have.class(styles['letter-field-value']);
      letters[2].should.have.class(styles['letter-field-name']);
      letters[3].should.have.class(styles['letter-operator']);
    });

    it('should render last text range with default style when applied', () => {
      const wrapper = mountQueryAssist({
        query: 'a a'
      });

      wrapper.find('QueryAssist').setState({
        dirty: true,
        styleRanges: [
          {start: 0, length: 1, style: 'text'},
          {start: 2, length: 1, style: 'text'}
        ]
      });

      const letters = wrapper.find<QueryAssist>(QueryAssist).instance().input!.querySelectorAll(`.${LETTER_CLASS}`);

      letters[0].should.have.class(styles['letter-text']);
      letters[1].should.have.class(styles.letterDefault);
      letters[2].should.have.class(styles.letterDefault);
    });

    it('should render last text range with text style when applied', () => {
      const wrapper = mountQueryAssist({
        query: 'a a'
      });

      wrapper.find('QueryAssist').setState({
        styleRanges: [
          {start: 0, length: 1, style: 'text'},
          {start: 2, length: 1, style: 'text'}
        ]
      });

      const letters = wrapper.find<QueryAssist>(QueryAssist).instance().input!.querySelectorAll(`.${LETTER_CLASS}`);

      letters[0].should.have.class(styles['letter-text']);
      letters[1].should.have.class(styles.letterDefault);
      letters[2].should.have.class(styles['letter-text']);
    });

    it('should disable field when component disabled', () => {
      const instance = mountQueryAssist({
        disabled: true
      }).find<QueryAssist>(QueryAssist).instance();

      instance.input!.should.have.attr('contenteditable', 'false');
    });

    it('should render glass when enabled', () => {
      const instance = mountQueryAssist({
        glass: true
      }).find<QueryAssist>(QueryAssist).instance();

      instance.glass!.should.exist;
    });

    it('should not render glass when disabled', () => {
      const instance = mountQueryAssist({
        glass: false
      }).find<QueryAssist>(QueryAssist).instance();

      should.not.exist(instance.glass);
    });

    it('should render clear when enabled', () => {
      const instance = mountQueryAssist({
        clear: true
      }).find<QueryAssist>(QueryAssist).instance();

      instance.clear!.should.exist;
    });

    it('should not render clear when disabled', () => {
      const instance = mountQueryAssist({
        clear: false
      }).find<QueryAssist>(QueryAssist).instance();

      should.not.exist(instance.clear);
    });

    it('should not render clear when query is empty', () => {
      const instance = mountQueryAssist({
        clear: true,
        query: ''
      }).find<QueryAssist>(QueryAssist).instance();

      should.not.exist(instance.clear);
    });

    it('should show loader on long request', () => {
      const wrapper = mountQueryAssist();
      wrapper.find('QueryAssist').setState({
        loading: true
      });

      wrapper.find<QueryAssist>(QueryAssist).instance().loader!.should.exist;
    });
  });

  describe('suggestions', () => {
    it('should not show popup when no suggestions provided', async () => {
      const instance = mountQueryAssist({
        dataSource: ({query, caret}) => ({
          query,
          caret,
          suggestions: []
        })
      }).find<QueryAssist>(QueryAssist).instance();

      await instance.requestData!();
      instance._popup!.isVisible().should.be.false;
    });

    it('should show popup when suggestions provided', async () => {
      const instance = mountQueryAssist().find<QueryAssist>(QueryAssist).instance();

      await instance.requestData!();
      instance._popup!.isVisible().should.be.true;
      instance._popup!.list!.should.exist;
    });

    it('should close popup with after zero suggestions provided', async () => {
      let currentSuggestions = suggestions;
      const instance = mountQueryAssist({
        dataSource: ({query, caret}) => ({
          query,
          caret,
          suggestions: currentSuggestions
        })
      }).find<QueryAssist>(QueryAssist).instance();

      await instance.requestData!();
      currentSuggestions = [];
      await instance.requestData!();
      instance._popup!.isVisible().should.be.false;
    });

    it('should show popup with proper suggestions', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      const wrapper = mountQueryAssist({}, {attachTo: container});
      const instance = wrapper.find<QueryAssist>(QueryAssist).instance();

      const TWICE = 2;

      await instance.requestData!();
      const list = instance._popup!.list!.container;
      const {length} = suggestions;

      list!.querySelectorAll('[data-test~=ring-list-item]').should.have.length(length);
      list!.querySelectorAll(`.${styles.highlight}`).should.have.length(length);
      list!.querySelectorAll(`.${styles.service}`).should.have.length(length * TWICE);

      wrapper.detach();
      document.body.removeChild(container);
    });

  });

  describe('completion', () => {
    const completeQuery = 'test';
    const middleCaret = completeQuery.length / 2;

    function getSuggestionText({prefix, option, suffix}: QueryAssistSuggestion) {
      return (prefix + option + suffix).replace(/\s/g, '\u00a0');
    }

    it('should complete by tab in the end of phrase', () => {
      const instance = mountQueryAssist({
        query: completeQuery
      }).find<QueryAssist>(QueryAssist).instance();

      return Promise.resolve(instance.requestData!()).then(() => {
        simulateCombo('tab');

        instance.input!.should.have.text(getSuggestionText(suggestions[0]));
      });
    });

    it('should complete selected suggestion by enter in the end of phrase', () => {
      const instance = mountQueryAssist({
        query: completeQuery
      }).find<QueryAssist>(QueryAssist).instance();

      return Promise.resolve(instance.requestData!()).then(() => {
        simulateCombo('down enter');

        instance.input!.should.have.text(getSuggestionText(suggestions[0]));
      });
    });

    it('should complete by tab in the middle of phrase', () => {
      const instance = mountQueryAssist({
        query: completeQuery,
        caret: middleCaret
      }).find<QueryAssist>(QueryAssist).instance();

      return Promise.resolve(instance.requestData!()).then(() => {
        simulateCombo('tab');

        instance.input!.should.have.text(getSuggestionText(suggestions[0]));
      });
    });

    it('should complete selected suggestion by enter in the middle of phrase', () => {
      const instance = mountQueryAssist({
        query: completeQuery,
        caret: middleCaret
      }).find<QueryAssist>(QueryAssist).instance();

      return Promise.resolve(instance.requestData!()).then(() => {
        simulateCombo('down enter');

        instance.input!.should.
          have.text(getSuggestionText(suggestions[0]) + completeQuery.substring(middleCaret));
      });
    });

    it('should complete selected suggestion by tab in the middle of phrase', () => {
      const instance = mountQueryAssist({
        query: completeQuery,
        caret: middleCaret
      }).find<QueryAssist>(QueryAssist).instance();

      return Promise.resolve(instance.requestData!()).then(() => {
        simulateCombo('down down down tab');

        instance.input!.should.have.text(getSuggestionText(suggestions[2]));
      });
    });

    it('should undo last applied completion', () => {
      const instance = mountQueryAssist({
        query: completeQuery,
        caret: middleCaret
      }).find<QueryAssist>(QueryAssist).instance();

      return Promise.resolve(instance.requestData!()).then(() => {
        simulateCombo('down down down tab');
        instance.input!.should.not.have.text(completeQuery);
        simulateCombo('meta+z');
        instance.input!.should.have.text(completeQuery);
      });
    });
  });

  describe('callbacks', () => {
    let onApply: (change: QueryAssistChange) => void;
    beforeEach(() => {
      onApply = sandbox.stub();
    });

    it('should call onApply', () => {
      mountQueryAssist({
        onApply
      });

      simulateCombo('enter');
      onApply.should.have.been.calledWithMatch({
        query: testQuery,
        caret: testQueryLength
      });
    });

    it('should call onApply when press ctrl/cmd + enter', () => {
      mountQueryAssist({
        onApply
      });

      simulateCombo('ctrl+enter');
      onApply.should.have.been.calledWithMatch({
        query: testQuery,
        caret: testQueryLength
      });
    });

    it('should call onClear', () => {
      const onClear = sandbox.stub();
      const instance = mountQueryAssist({
        clear: true,
        onClear
      }).find<QueryAssist>(QueryAssist).instance();

      Simulate.click(instance.clear!.buttonRef.current!);
      onClear.should.have.been.calledWithExactly();
    });
  });

  describe('request data', () => {
    it('should batch requests', () => {
      sandbox.useFakeTimers({toFake: ['setTimeout', 'clearTimeout']});

      const wrapper = mountQueryAssist();
      const instance = wrapper.find<QueryAssist>(QueryAssist).instance();
      const prevProps = instance.props;
      wrapper.setProps({
        delay: 100
      }, () => {
        instance.componentDidUpdate(prevProps);
        wrapper.prop('dataSource').resetHistory();

        instance.requestData!();
        instance.requestData!();
        instance.requestData!();
        sandbox.clock.tick(400);

        wrapper.prop('dataSource').should.have.been.calledOnce;
      });

    });
  });


  describe('custom actions', () => {
    it('should allow to pass custom actions', () => {
      const wrapper = mountQueryAssist({
        actions: [
          <div id={'A'} key={'A'}/>,
          <div id={'B'} key={'B'}/>
        ]
      });

      wrapper.find('#A').should.exist;
      wrapper.find('#B').should.exist;
    });
  });
});

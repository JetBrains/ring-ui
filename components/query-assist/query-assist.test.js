/* eslint-disable no-magic-numbers,react/no-find-dom-node */

import 'dom4';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {Simulate} from 'react-dom/test-utils';
import {mount} from 'enzyme';


import simulateCombo from '../../test-helpers/simulate-combo';

import QueryAssist from './query-assist';
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

  const defaultProps = () => ({
    query: testQuery,
    focus: true,
    dataSource: sandbox.spy(({query, caret}) => ({
      query,
      caret,
      suggestions
    }))
  });
  const mountQueryAssist = (props, options) =>
    mount(<QueryAssist {...defaultProps()} {...props}/>, options);

  describe('props to state passing', () => {
    it('should create component', () => {
      const wrapper = mountQueryAssist();

      wrapper.should.exist;
      wrapper.instance().input.should.exist;
    });

    it('should set state props to state on init', () => {
      const wrapper = mountQueryAssist();
      wrapper.should.have.state('query', testQuery);
      wrapper.should.have.state('placeholderEnabled', false);
    });

    it('should not set other props to state on init', () => {
      const wrapper = mountQueryAssist();

      wrapper.should.not.have.state('popupClassName');
      wrapper.should.not.have.state('dataSource');
      wrapper.should.not.have.state('disabled');
      wrapper.should.not.have.state('clear');
      wrapper.should.not.have.state('hint');
      wrapper.should.not.have.state('hintOnSelection');
      wrapper.should.not.have.state('glass');
      wrapper.should.not.have.state('placeholder');
      wrapper.should.not.have.state('onApply');
      wrapper.should.not.have.state('onChange');
      wrapper.should.not.have.state('onClear');
      wrapper.should.not.have.state('onFocusChange');
    });

    it('should set state props to state on update', () => {
      const wrapper = mountQueryAssist({
        query: 'update',
        caret: 2,
        focus: false
      });

      wrapper.should.have.state('query', 'update');
    });

    it('should set state props to immediateState on update', () => {
      const instance = mountQueryAssist({
        query: 'update',
        caret: 2,
        focus: false
      }).instance();

      instance.immediateState.query.should.equal('update');
      instance.immediateState.caret.should.equal(2);
      instance.immediateState.focus.should.equal(false);
    });

    it('should not set undefined state props to state on update', () => {
      const wrapper = mountQueryAssist();

      wrapper.setProps({
        query: undefined
      });

      wrapper.should.have.state('query', testQuery);
    });

    it('should not set caret with query on update', () => {
      const wrapper = mountQueryAssist();
      const instance = wrapper.instance();

      wrapper.setProps({
        query: 'update'
      });

      wrapper.should.have.state('query', 'update');
      instance.immediateState.query.should.equal('update');
      instance.immediateState.caret.should.equal(testQueryLength);
    });
  });


  describe('setFocus', () => {
    it('should set focus in query assist', () => {
      const instance = mountQueryAssist({focus: null}).instance();

      instance.setFocus(true);

      instance.immediateState.focus.should.equal(true);
    });

    it('should remove focus from query assist', () => {
      const instance = mountQueryAssist({focus: true}).instance();

      instance.setFocus(false);

      instance.immediateState.focus.should.equal(false);
    });
  });


  describe('shortcuts', () => {
    it('should enable shortcuts when we set focus', () => {
      const instance = mountQueryAssist({focus: null}).instance();
      instance.state.shortcuts.should.equal(false);

      instance.setFocus(true);
      instance.state.shortcuts.should.equal(true);
    });


    it('should disable shortcuts when we remove focus', () => {
      const instance = mountQueryAssist({focus: true}).instance();
      instance.state.shortcuts.should.equal(true);

      instance.setFocus(false);
      instance.state.shortcuts.should.equal(false);
    });


    it('should not enable shortcuts after rerender', () => {
      const wrapper = mountQueryAssist({focus: false, placeholder: 'bar'});
      const instance = wrapper.instance();
      instance.state.shortcuts.should.equal(false);

      wrapper.setProps({placeholder: 'foo'});
      instance.state.shortcuts.should.equal(false);
    });
  });


  describe('init', () => {
    it('requestData should exist', () => {
      const instance = mountQueryAssist().instance();
      instance.requestData.should.be.a('function');
      instance.requestData.should.equal(instance.requestHandler);
    });

    it('requestData should be debounced when delay set', () => {
      const instance = mountQueryAssist({
        delay: 0
      }).instance();
      instance.requestData.should.be.a('function');
      instance.requestData.should.not.equal(instance.requestHandler);
    });


    it('should create popup when autoOpen', done => {
      mountQueryAssist({
        autoOpen: true,
        dataSource: params => {
          params.should.not.have.property('omitSuggestions');
          done();
        }
      });
    });

    it('should not create popup by default', done => {
      mountQueryAssist({
        dataSource: params => {
          params.should.have.property('omitSuggestions', true);
          done();
        }
      });
    });
  });

  describe('rendering', () => {
    const LETTER_CLASS = styles.letter;

    it('should render letters', () => {
      const instance = mountQueryAssist().instance();

      instance.input.should.contain(`.${LETTER_CLASS}`);
      instance.input.queryAll(`.${LETTER_CLASS}`).
        should.have.length(testQueryLength);
    });


    it('should render nothing on empty query', () => {
      const instance = mountQueryAssist({
        query: ''
      }).instance();

      instance.input.textContent.should.be.empty;
    });

    it('should render nothing on falsy query', () => {
      const instance = mountQueryAssist({
        query: null
      }).instance();

      instance.input.textContent.should.be.empty;
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
      }).instance();

      instance.placeholder.should.exist;
      instance.placeholder.should.have.text('plz');
    });

    it('should not render placeholder when disabled on empty query', () => {
      const instance = mountQueryAssist({
        query: ''
      }).instance();

      should.not.exist(instance.placeholder);
    });

    it('should render with colors', () => {
      const wrapper = mountQueryAssist();

      wrapper.setState({
        styleRanges: [
          {start: 0, length: 1, style: 'text'},
          {start: 1, length: 1, style: 'field_value'},
          {start: 2, length: 1, style: 'field_name'},
          {start: 3, length: 1, style: 'operator'}
        ]
      });

      const letters = wrapper.instance().input.queryAll(`.${LETTER_CLASS}`);

      letters[0].should.have.class(styles['letter-text']);
      letters[1].should.have.class(styles['letter-field-value']);
      letters[2].should.have.class(styles['letter-field-name']);
      letters[3].should.have.class(styles['letter-operator']);
    });

    it('should render last text range with default style when applied', () => {
      const wrapper = mountQueryAssist({
        query: 'a a'
      });

      wrapper.setState({
        dirty: true,
        styleRanges: [
          {start: 0, length: 1, style: 'text'},
          {start: 2, length: 1, style: 'text'}
        ]
      });

      const letters = wrapper.instance().input.queryAll(`.${LETTER_CLASS}`);

      letters[0].should.have.class(styles['letter-text']);
      letters[1].should.have.class(styles.letterDefault);
      letters[2].should.have.class(styles.letterDefault);
    });

    it('should render last text range with text style when applied', () => {
      const wrapper = mountQueryAssist({
        query: 'a a'
      });

      wrapper.setState({
        styleRanges: [
          {start: 0, length: 1, style: 'text'},
          {start: 2, length: 1, style: 'text'}
        ]
      });

      const letters = wrapper.instance().input.queryAll(`.${LETTER_CLASS}`);

      letters[0].should.have.class(styles['letter-text']);
      letters[1].should.have.class(styles.letterDefault);
      letters[2].should.have.class(styles['letter-text']);
    });

    it('should disable field when component disabled', () => {
      const instance = mountQueryAssist({
        disabled: true
      }).instance();

      instance.input.should.have.attr('contenteditable', 'false');
      instance.input.should.have.class(styles.inputDisabled);
    });

    it('should render glass when enabled', () => {
      const instance = mountQueryAssist({
        glass: true
      }).instance();

      instance.glass.should.exist;
    });

    it('should not render glass when disabled', () => {
      const instance = mountQueryAssist({
        glass: false
      }).instance();

      should.not.exist(instance.glass);
    });

    it('should render clear when enabled', () => {
      const instance = mountQueryAssist({
        clear: true
      }).instance();

      instance.clear.should.exist;
    });

    it('should not render clear when disabled', () => {
      const instance = mountQueryAssist({
        clear: false
      }).instance();

      should.not.exist(instance.clear);
    });

    it('should not render clear when query is empty', () => {
      const instance = mountQueryAssist({
        clear: true,
        query: ''
      }).instance();

      should.not.exist(instance.clear);
    });

    it('should show loader on long request', () => {
      const wrapper = mountQueryAssist();
      wrapper.setState({
        loading: true
      });

      wrapper.instance().loader.should.exist;
    });
  });

  describe('suggestions', () => {
    it('should not show popup when no suggestions provided', done => {
      const instance = mountQueryAssist({
        dataSource: ({query, caret}) => ({
          query,
          caret,
          suggestions: []
        })
      }).instance();

      instance.requestData().
        then(() => {
          instance._popup.isVisible().should.be.false;
          done();
        });
    });

    it('should show popup when suggestions provided', done => {
      const instance = mountQueryAssist().instance();

      instance.requestData().
        then(() => {
          instance._popup.isVisible().should.be.true;
          instance._popup.list.should.exist;
          done();
        });
    });

    it('should close popup with after zero suggestions provided', done => {
      let currentSuggestions = suggestions;
      const instance = mountQueryAssist({
        dataSource: ({query, caret}) => ({
          query,
          caret,
          suggestions: currentSuggestions
        })
      }).instance();

      instance.requestData().
        then(() => {
          currentSuggestions = [];
          instance.requestData().
            then(() => {
              instance._popup.isVisible().should.be.false;
              done();
            });
        });
    });

    it('should show popup with proper suggestions', done => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      const wrapper = mountQueryAssist({}, {attachTo: container});
      const instance = wrapper.instance();

      const TWICE = 2;

      instance.requestData().
        then(() => {
          const list = findDOMNode(instance._popup.list);
          const {length} = suggestions;

          list.queryAll('[data-test~=ring-list-item]').should.have.length(length);
          list.queryAll(`.${styles.highlight}`).should.have.length(length);
          list.queryAll(`.${styles.service}`).should.have.length(length * TWICE);

          wrapper.detach();
          document.body.removeChild(container);
          done();
        }).catch(done);
    });

  });

  describe('completion', () => {
    const completeQuery = 'test';
    const middleCaret = completeQuery.length / 2;

    function getSuggestionText({prefix, option, suffix}) {
      return (prefix + option + suffix).replace(/\s/g, '\u00a0');
    }

    it('should complete by tab in the end of phrase', () => {
      const instance = mountQueryAssist({
        query: completeQuery
      }).instance();

      return instance.requestData().then(() => {
        simulateCombo('tab');

        instance.input.should.have.text(getSuggestionText(suggestions[0]));
      });
    });

    it('should complete selected suggestion by enter in the end of phrase', () => {
      const instance = mountQueryAssist({
        query: completeQuery
      }).instance();

      return instance.requestData().then(() => {
        simulateCombo('down enter');

        instance.input.should.have.text(getSuggestionText(suggestions[0]));
      });
    });

    it('should complete by tab in the middle of phrase', () => {
      const instance = mountQueryAssist({
        query: completeQuery,
        caret: middleCaret
      }).instance();

      return instance.requestData().then(() => {
        simulateCombo('tab');

        instance.input.should.have.text(getSuggestionText(suggestions[0]));
      });
    });

    it('should complete selected suggestion by enter in the middle of phrase', () => {
      const instance = mountQueryAssist({
        query: completeQuery,
        caret: middleCaret
      }).instance();

      return instance.requestData().then(() => {
        simulateCombo('down enter');

        instance.input.should.
          have.text(getSuggestionText(suggestions[0]) + completeQuery.substring(middleCaret));
      });
    });

    it('should complete selected suggestion by tab in the middle of phrase', () => {
      const instance = mountQueryAssist({
        query: completeQuery,
        caret: middleCaret
      }).instance();

      return instance.requestData().then(() => {
        simulateCombo('down down down tab');

        instance.input.should.have.text(getSuggestionText(suggestions[2]));
      });
    });
  });

  describe('callbacks', () => {
    let onApply;
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

    it('should call onApply from glass', () => {
      const instance = mountQueryAssist({
        glass: true,
        onApply
      }).instance();

      Simulate.click(findDOMNode(instance.glass));
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
      }).instance();

      Simulate.click(findDOMNode(instance.clear));
      onClear.should.have.been.calledWithExactly();
    });
  });

  describe('request data', () => {
    it('should batch requests', () => {
      sandbox.useFakeTimers({toFake: ['setTimeout', 'clearTimeout']});

      const wrapper = mountQueryAssist();
      const instance = wrapper.instance();
      wrapper.setProps({
        delay: 100
      }, () => {
        wrapper.prop('dataSource').resetHistory();

        instance.requestData();
        instance.requestData();
        instance.requestData();
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

/* eslint-disable func-names */

import React from 'react';
import 'dom4';

import QueryAssist from './query-assist';

import {findDOMNode} from 'react-dom';
import {Simulate} from 'react-addons-test-utils';
import renderIntoDocument from 'render-into-document';
import simulateKeypress from 'simulate-keypress';

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

  beforeEach(function () {
    this.renderQueryAssist = (params = {}) => {
      this.queryAssist = renderIntoDocument(React.createElement(QueryAssist, Object.assign({
        query: testQuery,
        focus: true,
        dataSource: this.sinon.spy(({query, caret}) => ({
          query,
          caret,
          suggestions
        }))
      }, params)));
    };
  });

  describe('props to state passing', () => {
    it('should create component', function () {
      this.renderQueryAssist();

      this.queryAssist.should.exist;
      this.queryAssist.input.should.exist;
    });

    it('should set state props to state on init', function () {
      this.renderQueryAssist();
      this.queryAssist.state.query.should.equal(testQuery);
      this.queryAssist.state.placeholderEnabled.should.equal(!testQuery);
    });

    it('should not set other props to state on init', function () {
      this.renderQueryAssist();

      should.not.exist(this.queryAssist.state.popupClassName);
      should.not.exist(this.queryAssist.state.dataSource);
      should.not.exist(this.queryAssist.state.disabled);
      should.not.exist(this.queryAssist.state.clear);
      should.not.exist(this.queryAssist.state.hint);
      should.not.exist(this.queryAssist.state.hintOnSelection);
      should.not.exist(this.queryAssist.state.glass);
      should.not.exist(this.queryAssist.state.placeholder);
      should.not.exist(this.queryAssist.state.onApply);
      should.not.exist(this.queryAssist.state.onChange);
      should.not.exist(this.queryAssist.state.onClear);
      should.not.exist(this.queryAssist.state.onFocusChange);
    });

    it('should set state props to state on update', function () {
      this.renderQueryAssist({
        query: 'update',
        caret: 2,
        focus: false
      });

      this.queryAssist.state.query.should.equal('update');
    });

    it('should set state props to immediateState on update', function () {
      this.renderQueryAssist({
        query: 'update',
        caret: 2,
        focus: false
      });

      this.queryAssist.immediateState.query.should.equal('update');
      this.queryAssist.immediateState.caret.should.equal(2);
      this.queryAssist.immediateState.focus.should.equal(false);
    });

    it('should not set undefined state props to state on update', function () {
      this.renderQueryAssist();

      this.queryAssist.rerender({
        query: undefined
      });

      this.queryAssist.state.query.should.equal(testQuery);
    });

    it('should not set caret with query on update', function () {
      this.renderQueryAssist();

      this.queryAssist.rerender({
        query: 'update'
      });

      this.queryAssist.state.query.should.equal('update');
      this.queryAssist.immediateState.query.should.equal('update');
      this.queryAssist.immediateState.caret.should.equal(testQueryLength);
    });
  });


  describe('setFocus', () => {
    it('should set focus in query assist', function () {
      this.renderQueryAssist({focus: null});

      this.queryAssist.setFocus(true);

      this.queryAssist.immediateState.focus.should.equal(true);
    });

    it('should remove focus from query assist', function () {
      this.renderQueryAssist({focus: true});

      this.queryAssist.setFocus(false);

      this.queryAssist.immediateState.focus.should.equal(false);
    });
  });


  describe('shortcuts', () => {
    it('should enable shortcuts when we set focus', function () {
      this.renderQueryAssist({focus: null});
      this.queryAssist.shortcutsEnabled().should.equal(false);

      this.queryAssist.setFocus(true);
      this.queryAssist.shortcutsEnabled().should.equal(true);
    });


    it('should disable shortcuts when we remove focus', function () {
      this.renderQueryAssist({focus: true});
      this.queryAssist.shortcutsEnabled().should.equal(true);

      this.queryAssist.setFocus(false);
      this.queryAssist.shortcutsEnabled().should.equal(false);
    });


    it('should not enable shortcuts after rerender', function () {
      this.renderQueryAssist({focus: false, placeholder: 'bar'});
      this.queryAssist.shortcutsEnabled().should.equal(false);

      this.queryAssist.rerender({placeholder: 'foo'});
      this.queryAssist.shortcutsEnabled().should.equal(false);
    });
  });


  describe('init', () => {
    it('requestData should exist', function () {
      this.renderQueryAssist();
      this.queryAssist.requestData.should.be.a('function');
      this.queryAssist.requestData.should.equal(this.queryAssist.boundRequestHandler);
    });

    it('requestData should be debounced when delay set', function () {
      this.renderQueryAssist({
        delay: 0
      });
      this.queryAssist.requestData.should.be.a('function');
      this.queryAssist.requestData.should.not.equal(this.queryAssist.boundRequestHandler);
    });


    it('should create popup when autoOpen', function (done) {
      this.renderQueryAssist({
        autoOpen: true,
        dataSource: params => {
          params.should.not.have.property('omitSuggestions');
          done();
        }
      });
    });

    it('should not create popup by default', function (done) {
      this.renderQueryAssist({
        dataSource: params => {
          params.should.have.property('omitSuggestions', true);
          done();
        }
      });
    });
  });

  describe('rendering', () => {
    const LETTER_CLASS = 'ring-query-assist__letter';

    it('should render letters', function () {
      this.renderQueryAssist();

      this.queryAssist.input.should.contain(`.${LETTER_CLASS}`);
      this.queryAssist.input.queryAll(`.${LETTER_CLASS}`).
        should.have.length(testQueryLength);
    });


    it('should render nothing on empty query', function () {
      this.renderQueryAssist({
        query: ''
      });

      this.queryAssist.input.textContent.should.be.empty;
    });

    it('should render nothing on falsy query', function () {
      this.renderQueryAssist({
        query: null
      });

      this.queryAssist.input.textContent.should.be.empty;
    });

    it('Shouldnt make duplicate requests for styleRanges on initiating if query is provided', function () {
      this.renderQueryAssist();

      //Emulate multiple rerender when rendering component with react-ng
      this.queryAssist.rerender({});
      this.queryAssist.rerender({});

      this.queryAssist.props.dataSource.should.have.been.calledOnce;
    });

    it('should render placeholder when enabled on empty query', function () {
      this.renderQueryAssist({
        query: '',
        placeholder: 'plz'
      });

      this.queryAssist.refs.placeholder.should.exist;
      this.queryAssist.refs.placeholder.should.have.text('plz');
    });

    it('should not render placeholder when disabled on empty query', function () {
      this.renderQueryAssist({
        query: ''
      });

      should.not.exist(this.queryAssist.refs.placeholder);
    });

    it('should render with colors', function () {
      this.renderQueryAssist();

      this.queryAssist.setState({
        styleRanges: [
          {start: 0, length: 1, style: 'text'},
          {start: 1, length: 1, style: 'field_value'},
          {start: 2, length: 1, style: 'field_name'},
          {start: 3, length: 1, style: 'operator'}
        ]
      });

      const letters = this.queryAssist.input.queryAll(`.${LETTER_CLASS}`);

      letters[0].should.have.class(`${LETTER_CLASS}_text`);
      letters[1].should.have.class(`${LETTER_CLASS}_field-value`);
      letters[2].should.have.class(`${LETTER_CLASS}_field-name`);
      letters[3].should.have.class(`${LETTER_CLASS}_operator`);
    });

    it('should render last text range with default style when applied', function () {
      this.renderQueryAssist({
        query: 'a a'
      });

      this.queryAssist.setState({
        dirty: true,
        styleRanges: [
          {start: 0, length: 1, style: 'text'},
          {start: 2, length: 1, style: 'text'}
        ]
      });

      const letters = this.queryAssist.input.queryAll(`.${LETTER_CLASS}`);

      letters[0].should.have.class(`${LETTER_CLASS}_text`);
      letters[1].should.have.class(`${LETTER_CLASS}_default`);
      letters[2].should.have.class(`${LETTER_CLASS}_default`);
    });

    it('should render last text range with text style when applied', function () {
      this.renderQueryAssist({
        query: 'a a'
      });

      this.queryAssist.setState({
        styleRanges: [
          {start: 0, length: 1, style: 'text'},
          {start: 2, length: 1, style: 'text'}
        ]
      });

      const letters = this.queryAssist.input.queryAll(`.${LETTER_CLASS}`);

      letters[0].should.have.class(`${LETTER_CLASS}_text`);
      letters[1].should.have.class(`${LETTER_CLASS}_default`);
      letters[2].should.have.class(`${LETTER_CLASS}_text`);
    });

    it('should disable field when component disabled', function () {
      this.renderQueryAssist({
        disabled: true
      });

      this.queryAssist.input.should.have.attr('contenteditable', 'false');
      this.queryAssist.input.should.have.class('ring-input_disabled');
    });

    it('should render glass when enabled', function () {
      this.renderQueryAssist({
        glass: true
      });

      this.queryAssist.refs.glass.should.exist;
    });

    it('should not render glass when disabled', function () {
      this.renderQueryAssist({
        glass: false
      });

      should.not.exist(this.queryAssist.refs.glass);
    });

    it('should render clear when enabled', function () {
      this.renderQueryAssist({
        clear: true
      });

      this.queryAssist.refs.clear.should.exist;
    });

    it('should not render clear when disabled', function () {
      this.renderQueryAssist({
        clear: false
      });

      should.not.exist(this.queryAssist.refs.clear);
    });

    it('should not render clear when query is empty', function () {
      this.renderQueryAssist({
        clear: true,
        query: ''
      });

      should.not.exist(this.queryAssist.refs.clear);
    });

    it('should show loader on long request', function () {
      this.renderQueryAssist();
      this.queryAssist.setState({
        loading: true
      });

      this.queryAssist.refs.loader.should.exist;
    });
  });

  describe('suggestions', () => {
    it('should not show popup when no suggestions provided', function (done) {
      this.renderQueryAssist({
        dataSource: ({query, caret}) => ({
          query,
          caret,
          suggestions: []
        })
      });

      this.queryAssist.requestData().
        then(() => {
          this.queryAssist._popup.isVisible().should.be.false;
          done();
        });
    });

    it('should show popup when suggestions provided', function (done) {
      this.renderQueryAssist();

      this.queryAssist.requestData().
        then(() => {
          this.queryAssist._popup.isVisible().should.be.true;
          this.queryAssist._popup.refs.List.should.exist;
          done();
        });
    });

    it('should close popup with after zero suggestions provided', function (done) {
      this.renderQueryAssist({
        dataSource: ({query, caret}) => ({
          query,
          caret,
          suggestions: this.suggestions
        })
      });

      this.suggestions = suggestions;
      this.queryAssist.requestData().
        then(() => {
          this.suggestions = [];
          this.queryAssist.requestData().
            then(() => {
              this.queryAssist._popup.isVisible().should.be.false;
              done();
            });
        });
    });

    it('should show popup with proper suggestions', function (done) {
      this.renderQueryAssist();

      const TWICE = 2;

      this.queryAssist.requestData().
        then(() => {
          const list = findDOMNode(this.queryAssist._popup.refs.List);
          const {length} = suggestions;

          list.queryAll('.ring-list__item').should.have.length(length);
          list.queryAll('.ring-list__highlight').should.have.length(length);
          list.queryAll('.ring-list__service').should.have.length(length * TWICE);
          done();
        });
    });

  });

  describe('completion', () => {
    const completeQuery = 'test';
    const middleCaret = completeQuery.length / 2;

    function getSuggestionText({prefix, option, suffix}) {
      return (prefix + option + suffix).replace(/\s/g, '\u00a0');
    }

    it('should complete by tab in the end of phrase', function () {
      this.renderQueryAssist({
        query: completeQuery
      });

      return this.queryAssist.requestData().then(() => {
        simulateKeypress(null, 9); // press tab

        this.queryAssist.input.should.have.text(getSuggestionText(suggestions[0]));
      });
    });

    it('should complete selected suggestion by enter in the end of phrase', function () {
      this.renderQueryAssist({
        query: completeQuery
      });

      return this.queryAssist.requestData().then(() => {
        simulateKeypress(null, 40); // press down
        simulateKeypress(null, 13); // press enter

        this.queryAssist.input.should.have.text(getSuggestionText(suggestions[0]));
      });
    });

    it('should complete by tab in the middle of phrase', function () {
      this.renderQueryAssist({
        query: completeQuery,
        caret: middleCaret
      });

      return this.queryAssist.requestData().then(() => {
        simulateKeypress(null, 9); // press tab

        this.queryAssist.input.should.have.text(getSuggestionText(suggestions[0]));
      });
    });

    it('should complete selected suggestion by enter in the middle of phrase', function () {
      this.renderQueryAssist({
        query: completeQuery,
        caret: middleCaret
      });

      return this.queryAssist.requestData().then(() => {
        simulateKeypress(null, 40); // press down
        simulateKeypress(null, 13); // press enter

        this.queryAssist.input.should.have.text(getSuggestionText(suggestions[0]) + completeQuery.substring(middleCaret));
      });
    });

    it('should complete selected suggestion by tab in the middle of phrase', function () {
      this.renderQueryAssist({
        query: completeQuery,
        caret: middleCaret
      });

      return this.queryAssist.requestData().then(() => {
        simulateKeypress(null, 40); // press down
        simulateKeypress(null, 40); // press down
        simulateKeypress(null, 40); // press down
        simulateKeypress(null, 9); // press tab

        this.queryAssist.input.should.have.text(getSuggestionText(suggestions[2]));
      });
    });
  });

  describe('callbacks', () => {
    const ENTER_KEY = 13;

    let onApply;
    beforeEach(function () {
      onApply = this.sinon.stub();
    });

    it('should call onApply', function () {
      this.renderQueryAssist({
        onApply
      });

      simulateKeypress(null, ENTER_KEY);
      onApply.should.have.been.calledWithMatch({
        query: testQuery,
        caret: testQueryLength
      });
    });

    it('should call onApply when press ctrl/cmd + enter', function () {
      this.renderQueryAssist({
        onApply
      });

      simulateKeypress(null, ENTER_KEY, ['ctrl']);
      onApply.should.have.been.calledWithMatch({
        query: testQuery,
        caret: testQueryLength
      });
    });

    it('should call onApply from glass', function () {
      this.renderQueryAssist({
        glass: true,
        onApply
      });

      Simulate.click(this.queryAssist.refs.glass.node);
      onApply.should.have.been.calledWithMatch({
        query: testQuery,
        caret: testQueryLength
      });
    });

    it('should call onClear', function () {
      const onClear = this.sinon.stub();
      this.renderQueryAssist({
        clear: true,
        onClear
      });

      Simulate.click(this.queryAssist.refs.clear.node);
      onClear.should.have.been.calledWithExactly();
    });
  });

  describe('request data', () => {
    it('should batch requests', function () {
      this.sinon.useFakeTimers();

      this.renderQueryAssist();
      this.queryAssist.rerender({
        delay: 100
      }, () => {
        this.queryAssist.props.dataSource.reset();

        this.queryAssist.requestData();
        this.queryAssist.requestData();
        this.queryAssist.requestData();
        this.sinon.clock.tick(400);

        this.queryAssist.props.dataSource.should.have.been.calledOnce;
      });

    });
  });
});

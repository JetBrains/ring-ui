import React from 'react';
import $ from 'jquery';

import QueryAssist from './query-assist';

import { findDOMNode } from 'react-dom';
import { Simulate } from 'react-addons-test-utils';
import renderIntoDocument from 'render-into-document';
import simulateKeypress from 'simulate-keypress';
import Sniffr from 'sniffr';

describe('QueryAssist', function () {
  let sniffr = new Sniffr();
  sniffr.sniff();

  var testQuery = 'oooooooooooo';
  var testQueryLength = testQuery.length;

  var suggestions = [{
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
        dataSource: this.sinon.stub().returns({})
      }, params)));
    }
  });

  describe('props to state passing', function () {
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


  describe('rendering', function () {
    var LETTER_CLASS = 'ring-query-assist__letter';

    it('should render letters', function () {
      this.renderQueryAssist();

      $(this.queryAssist.input).should.have.descendants('.' + LETTER_CLASS);
      $(this.queryAssist.input).find('.' + LETTER_CLASS).should.have.length(testQueryLength);
    });


    it('should render nothing on empty query', function () {
      this.renderQueryAssist({
        query: ''
      });

      this.queryAssist.input.innerHTML.should.be.empty;
    });

    it('should render nothing on falsy query', function () {
      this.renderQueryAssist({
        query: null
      });

      this.queryAssist.input.innerHTML.should.be.empty;
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
      $(this.queryAssist.refs.placeholder).should.have.text('plz');
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

      var letters = $(this.queryAssist.input).find('.' + LETTER_CLASS);

      letters.eq(0).should.have.class(LETTER_CLASS + '_text');
      letters.eq(1).should.have.class(LETTER_CLASS + '_field-value');
      letters.eq(2).should.have.class(LETTER_CLASS + '_field-name');
      letters.eq(3).should.have.class(LETTER_CLASS + '_operator');
    });


    it('should disable field when component disabled', function () {
      this.renderQueryAssist({
        disabled: true
      });

      $(this.queryAssist.input).should.have.attr('contenteditable', 'false');
      $(this.queryAssist.input).should.have.class('ring-input_disabled');
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

  describe('suggestions', function () {
    it('should not create popup when no suggestions provided', function () {
      this.renderQueryAssist();

      this.queryAssist.renderPopup([]);

      should.not.exist(this.queryAssist._popup);
    });

    it('should create popup when suggestions provided', function () {
      this.renderQueryAssist();

      this.queryAssist.renderPopup(suggestions);

      this.queryAssist._popup.should.exist;
      this.queryAssist._popup.refs.List.should.exist;
    });

    it('should close popup with after zero suggestions provided', function () {
      this.renderQueryAssist();

      this.queryAssist.renderPopup(suggestions);
      this.queryAssist.renderPopup([]);

      this.queryAssist._popup.isVisible().should.be.false;
    });

    it('should create popup with proper suggestions', function () {
      this.renderQueryAssist();

      this.queryAssist.renderPopup(suggestions);

      var list = $(findDOMNode(this.queryAssist._popup.refs.List));

      list.find('.ring-list__item').should.have.length(suggestions.length);
      list.find('.ring-list__highlight').should.have.length(suggestions.length);
      list.find('.ring-list__service').should.have.length(suggestions.length * 2);
    });

  });

  describe('completion', function () {
    var completeQuery = 'test';
    var middleCaret = completeQuery.length / 2;

    function getSuggestionText(suggestion) {
      return (
        suggestion.prefix +
        suggestion.option +
        suggestion.suffix
      ).replace(/\s/g, '\u00a0');
    }

    it('should complete by tab in the end of phrase', function () {
      this.renderQueryAssist({
        query: completeQuery
      });

      this.queryAssist.renderPopup(suggestions);

      simulateKeypress(null, 9); // press tab
      $(this.queryAssist.input).text().should.equal(getSuggestionText(suggestions[0]));
    });

    it('should complete selected suggestion by enter in the end of phrase', function () {
      this.renderQueryAssist({
        query: completeQuery
      });

      this.queryAssist.renderPopup(suggestions);

      simulateKeypress(null, 40); // press down
      simulateKeypress(null, 13); // press enter
      $(this.queryAssist.input).text().should.equal(getSuggestionText(suggestions[0]));
    });

    it('should complete by tab in the middle of phrase', function () {
      this.renderQueryAssist({
        query: completeQuery,
        caret: middleCaret
      });

      this.queryAssist.renderPopup(suggestions);

      simulateKeypress(null, 9); // press tab
      $(this.queryAssist.input).text().should.equal(getSuggestionText(suggestions[0]));
    });

    it('should complete selected suggestion by enter in the middle of phrase', function () {
      this.renderQueryAssist({
        query: completeQuery,
        caret: middleCaret
      });
      this.queryAssist.renderPopup(suggestions);

      simulateKeypress(null, 40); // press down
      simulateKeypress(null, 13); // press enter
      $(this.queryAssist.input).text().should.equal(getSuggestionText(suggestions[0]) + completeQuery.substring(middleCaret));
    });

    it('should complete selected suggestion by tab in the middle of phrase', function () {
      this.renderQueryAssist({
        query: completeQuery,
        caret: middleCaret
      });
      this.queryAssist.renderPopup(suggestions);

      simulateKeypress(null, 40); // press down
      simulateKeypress(null, 40); // press down
      simulateKeypress(null, 40); // press down
      simulateKeypress(null, 9); // press tab
      $(this.queryAssist.input).text().should.equal(getSuggestionText(suggestions[2]));
    });
  });

  describe('callbacks', function () {
    it('should call onApply', function () {
      var onApply = this.sinon.stub();
      this.renderQueryAssist({
        onApply: onApply
      });

      simulateKeypress(null, 13); // press enter
      onApply.should.have.been.calledWithMatch({
        query: testQuery,
        caret: testQueryLength
      });
    });

    it('should call onApply from glass', function () {
      var onApply = this.sinon.stub();
      this.renderQueryAssist({
        glass: true,
        onApply: onApply
      });

      Simulate.click(this.queryAssist.refs.glass.node);
      onApply.should.have.been.calledWithMatch({
        query: testQuery,
        caret: testQueryLength
      });
    });

    it('should call onClear', function () {
      var onClear = this.sinon.stub();
      this.renderQueryAssist({
        clear: true,
        onClear: onClear
      });

      Simulate.click(this.queryAssist.refs.clear.node);
      onClear.should.have.been.calledWithExactly();
    });
  });

  describe('request data', function () {
    beforeEach(function () {
      this.timeout = this.sinon.useFakeTimers();
    });

    it('should batch requests', function (done) {
      this.renderQueryAssist();
      this.queryAssist.rerender({
        delay: 100
      }, () => {
        this.queryAssist.props.dataSource.reset();

        this.queryAssist.requestData();
        this.queryAssist.requestData();
        this.queryAssist.requestData();
        this.timeout.tick(4000);

        this.queryAssist.props.dataSource.should.have.been.calledOnce;
        done();
      });

    });
  });
});

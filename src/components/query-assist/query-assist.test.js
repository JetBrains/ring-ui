describe.only('QueryAssist', function () {
  var QueryAssist = require('./query-assist');
  var $ = require('jquery');

  var simulateKeypress = require('simulate-keypress');
  var renderIntoDocument = require('render-into-document');

  var testQuery = 'oooooooooooo';
  var testQueryLength = testQuery.length;
  var testFocus = true;

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
  },{
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
  },{
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
  },{
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
    this.queryAssist = renderIntoDocument(new QueryAssist({
      query: testQuery,
      focus: true,
      dataSource: function () {
        return {};
      }
    }));
  });

  describe('props to state passing', function () {
    it('should create component', function () {
      this.queryAssist.should.exist;
      this.queryAssist.refs.input.should.exist;
    });

    it('should set state props to state on init', function () {
      this.queryAssist.state.query.should.equal(testQuery);
      this.queryAssist.state.caret.should.equal(testQueryLength);
      this.queryAssist.state.focus.should.equal(testFocus);
    });

    it('should not set other props to state on init', function () {
      should.not.exist(this.queryAssist.state.popupClassName);
      should.not.exist(this.queryAssist.state.dataSource);
      should.not.exist(this.queryAssist.state.disabled);
      should.not.exist(this.queryAssist.state.hint);
      should.not.exist(this.queryAssist.state.hintOnSelection);
      should.not.exist(this.queryAssist.state.glass);
      should.not.exist(this.queryAssist.state.placeholder);
      should.not.exist(this.queryAssist.state.onApply);
      should.not.exist(this.queryAssist.state.onChange);
      should.not.exist(this.queryAssist.state.onFocusChange);
    });

    it('should set state props to state on update', function () {
      this.queryAssist.setProps({
        query: 'update',
        caret: 2,
        focus: false
      });

      this.queryAssist.state.query.should.equal('update');
      this.queryAssist.state.caret.should.equal(2);
      this.queryAssist.state.focus.should.equal(false);
    });

    it('should not set undefined state props to state on update', function () {
      this.queryAssist.setProps({
        query: undefined,
        caret: undefined,
        focus: undefined
      });

      this.queryAssist.state.query.should.equal(testQuery);
      this.queryAssist.state.caret.should.equal(testQueryLength);
      this.queryAssist.state.focus.should.equal(testFocus);
    });

    it('should not set caret with query on update', function () {
      this.queryAssist.setProps({
        query: 'update'
      });

      this.queryAssist.state.query.should.equal('update');
      this.queryAssist.state.caret.should.equal(testQueryLength);
    });
  });


  describe('rendering', function () {
    var LETTER_CLASS = 'ring-query-assist__letter';

    it('should render letters', function () {
      $(this.queryAssist.refs.input.getDOMNode()).should.have.descendants('.' + LETTER_CLASS);
      $(this.queryAssist.refs.input.getDOMNode()).find('.' + LETTER_CLASS).should.have.length(testQueryLength);
    });


    it('should render nothing on empty query', function () {
      this.queryAssist.setProps({
        query: ''
      });

      $(this.queryAssist.refs.input.getDOMNode()).should.be.empty;
    });

    it('should render nothing on falsy query', function () {
      this.queryAssist.state.query = null;
      this.queryAssist.forceUpdate();

      $(this.queryAssist.refs.input.getDOMNode()).should.be.empty;
    });

    it('should render placeholder when enabled on empty query', function () {
      this.queryAssist.setProps({
        query: '',
        placeholder: 'plz'
      });

      $(this.queryAssist.getDOMNode()).should.have.descendants('.ring-query-assist__placeholder');
      $(this.queryAssist.getDOMNode()).find('.ring-query-assist__placeholder').should.have.text('plz');
    });

    it('should not render placeholder when disabled on empty query', function () {
      this.queryAssist.setProps({
        query: ''
      });

      $(this.queryAssist.getDOMNode()).should.not.have.descendants('.ring-query-assist__placeholder');
    });

    it('should render with colors', function () {
      this.queryAssist.setState({
        styleRanges: [
          {start: 0, length: 1, style: 'text'},
          {start: 1, length: 1, style: 'field_value'},
          {start: 2, length: 1, style: 'field_name'},
          {start: 3, length: 1, style: 'operator'}
        ]
      });

      var letters = $(this.queryAssist.refs.input.getDOMNode()).find('.' + LETTER_CLASS);

      letters.eq(0).should.have.class(LETTER_CLASS + '_text');
      letters.eq(1).should.have.class(LETTER_CLASS + '_field-value');
      letters.eq(2).should.have.class(LETTER_CLASS + '_field-name');
      letters.eq(3).should.have.class(LETTER_CLASS + '_operator');
    });


    it('should disable field when component disabled', function () {
      this.queryAssist.setProps({
        disabled: true
      });

      $(this.queryAssist.refs.input.getDOMNode()).should.have.attr('contenteditable', 'false');
      $(this.queryAssist.refs.input.getDOMNode()).should.have.class('ring-input_disabled');
    });

    it('should render glass when enabled', function () {
      this.queryAssist.setProps({
        glass: true
      });

      $(this.queryAssist.getDOMNode()).should.have.descendants('.ring-query-assist__glass');
    });

    it('should not render glass when disabled', function () {
      this.queryAssist.setProps({
        glass: false
      });

      $(this.queryAssist.getDOMNode()).should.not.have.descendants('.ring-query-assist__glass');
    });
  });

  describe('suggestions', function () {
    it('should not create popup when no suggestions provided', function () {
      this.queryAssist.renderPopup();

      should.not.exist(this.queryAssist._popup);
    });

    it('should create popup when suggestions provided', function () {
      this.queryAssist.setState({
        suggestions: suggestions
      });
      this.queryAssist.renderPopup();

      this.queryAssist._popup.should.exist;
      this.queryAssist._popup.refs.List.should.exist;
    });

    it('should close popup with after zero suggestions provided', function () {
      this.queryAssist.setState({
        suggestions: suggestions
      });
      this.queryAssist.renderPopup();

      this.queryAssist.setState({
        suggestions: []
      });
      this.queryAssist.renderPopup();

      this.queryAssist._popup.isVisible().should.be.false;
    });

    it('should create popup with proper suggestions', function () {
      this.queryAssist.setState({
        suggestions: suggestions
      });
      this.queryAssist.renderPopup();

      var list = $(this.queryAssist._popup.refs.List.getDOMNode());

      list.find('.ring-list__item').should.have.length(suggestions.length);
      list.find('.ring-list__highlight').should.have.length(suggestions.length);
      list.find('.ring-list__service').should.have.length(suggestions.length * 2);
    });

  });

  describe('completion', function() {
    var completeQuery = 'test';
    var competeCaret = completeQuery.length;
    var middleCaret = competeCaret / 2;

    function getSuggestionText(suggestion) {
     return (
        suggestion.prefix +
        suggestion.option +
        suggestion.suffix
      ).replace(/\s/g, '\u00a0');
    }

    it('should complete by tab in the end of phrase', function () {
      this.queryAssist.setState({
        query: completeQuery,
        caret: competeCaret,
        suggestions: suggestions
      });
      this.queryAssist.renderPopup();

      simulateKeypress(null, 9); // press tab
      $(this.queryAssist.refs.input.getDOMNode()).text().should.equal(getSuggestionText(suggestions[0]));
    });

    it('should complete selected suggestion by enter in the end of phrase', function () {
      this.queryAssist.setState({
        query: completeQuery,
        caret: competeCaret,
        suggestions: suggestions
      });
      this.queryAssist.renderPopup();

      simulateKeypress(null, 40); // press down
      simulateKeypress(null, 13); // press enter
      $(this.queryAssist.refs.input.getDOMNode()).text().should.equal(getSuggestionText(suggestions[0]));
    });

    it('should complete by tab in the middle of phrase', function () {
      this.queryAssist.setState({
        query: completeQuery,
        caret: middleCaret,
        suggestions: suggestions
      });
      this.queryAssist.renderPopup();

      simulateKeypress(null, 9); // press tab
      $(this.queryAssist.refs.input.getDOMNode()).text().should.equal(getSuggestionText(suggestions[0]));
    });

    it('should complete selected suggestion by enter in the middle of phrase', function () {
      this.queryAssist.setState({
        query: completeQuery,
        caret: middleCaret,
        suggestions: suggestions
      });
      this.queryAssist.renderPopup();

      simulateKeypress(null, 40); // press down
      simulateKeypress(null, 13); // press enter
      $(this.queryAssist.refs.input.getDOMNode()).text().should.equal(getSuggestionText(suggestions[0]) + completeQuery.substring(middleCaret));
    });

    it('should complete selected suggestion by tab in the middle of phrase', function () {
      this.queryAssist.setState({
        query: completeQuery,
        caret: middleCaret,
        suggestions: suggestions
      });
      this.queryAssist.renderPopup();

      simulateKeypress(null, 40); // press down
      simulateKeypress(null, 40); // press down
      simulateKeypress(null, 40); // press down
      simulateKeypress(null, 9); // press tab
      $(this.queryAssist.refs.input.getDOMNode()).text().should.equal(getSuggestionText(suggestions[2]));
    });
  });
});

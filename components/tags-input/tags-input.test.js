/* eslint-disable func-names */

import React from 'react';
import {renderIntoDocument, Simulate} from 'react-dom/test-utils';

import TagsInput from './tags-input';

describe('Tags Input', () => {
  const fakeTags = [{key: 1, label: 'test1'}];

  beforeEach(function () {
    this.tagsInput = renderIntoDocument(React.createElement(TagsInput, {tags: fakeTags}));
  });


  describe('DOM', () => {
    it('should render select in input mode', function () {
      this.tagsInput.node.should.contain('.ring-select_input-mode');
    });

    it('Should use passed className', function () {
      this.tagsInput.rerender({
        className: 'test-class'
      });
      this.tagsInput.node.should.have.class('test-class');
    });
  });


  describe('Select', () => {
    it('should auto open popup', () => {
      const tagsInput = renderIntoDocument(
        React.createElement(TagsInput, {tags: fakeTags, autoOpen: true})
      );

      tagsInput.select._popup.isVisible().should.be.true;
    });

    it('Should add tag', function () {
      this.tagsInput.addTag({key: 2, label: 'test2'});
      this.tagsInput.state.tags.should.deep.contain({key: 2, label: 'test2'});
    });

    it('Should remove tag', function () {
      return this.tagsInput.onRemoveTag(fakeTags[0]).then(() => {
        this.tagsInput.state.tags.should.be.empty;
      });
    });

    it('Should clear selected value after adding tag', function () {
      this.sinon.spy(this.tagsInput.select, 'clear');
      this.tagsInput.addTag({key: 2, label: 'test2'});

      this.tagsInput.select.clear.should.have.been.called;
    });

    it('Should clear select input after adding tag', function () {
      this.sinon.spy(this.tagsInput.select, 'filterValue');
      this.tagsInput.addTag({key: 2, label: 'test2'});

      this.tagsInput.select.filterValue.should.have.been.calledWith('');
    });

    it('Should copy tags to state on receiving props', function () {
      const newTags = [{key: 4, label: 'test5'}];

      this.tagsInput.updateStateFromProps({tags: newTags});
    });
  });


  describe('DataSource', () => {
    it('Should call datasource and set suggestions returned', function () {
      const suggestions = [{key: 14, label: 'suggestion 14'}];

      const dataSource = this.sinon.spy(() => Promise.resolve(suggestions));

      this.tagsInput.rerender({dataSource});

      this.sinon.spy(this.tagsInput, 'setState');
      return this.tagsInput.loadSuggestions().then(() => {
        this.tagsInput.state.suggestions.should.deep.equal(suggestions);
      });
    });

    it('Should call datasource with query entered', function () {
      const dataSource = this.sinon.spy(() => Promise.resolve([]));
      this.tagsInput.rerender({dataSource});
      this.tagsInput.loadSuggestions('testquery');

      dataSource.should.have.been.calledWith({query: 'testquery'});
    });

    it('Should call datasource when arrow down pressed', function () {
      const dataSource = this.sinon.spy(() => Promise.resolve([]));
      this.tagsInput.rerender({dataSource});
      this.tagsInput.select.props.onBeforeOpen();

      dataSource.should.have.been.calledWith({query: undefined});
    });
  });


  describe('Loading', () => {
    it('Should turn on loading message immediately after initialization', function () {
      this.tagsInput.state.should.have.property('loading', true);
    });

    it('Should turn on loading message while loading suggestions', function () {
      const dataSource = this.sinon.spy(() => Promise.resolve([]));
      this.tagsInput.rerender({dataSource});

      this.tagsInput.state.should.have.property('loading', true);

      return this.tagsInput.loadSuggestions().then(() => {
        this.tagsInput.state.should.have.property('loading', false);
      });
    });
  });

  it('Should drop existing tags from suggestions by key', function () {
    const notAddedSuggestions = this.tagsInput.filterExistingTags([
      {key: 1, label: 'test1'},
      {key: 2, label: 'test2'}
    ]);

    notAddedSuggestions.should.be.deep.equal([{key: 2, label: 'test2'}]);
  });


  describe('Shortcuts', () => {
    it('should enable shortcuts on input focus', function () {
      Simulate.focus(this.tagsInput.getInputNode());

      this.tagsInput.state.shortcuts.should.be.true;
    });

    it('should disable shortcuts when input lose focus', function () {
      Simulate.focus(this.tagsInput.getInputNode());
      Simulate.blur(this.tagsInput.getInputNode());

      this.tagsInput.state.shortcuts.should.be.false;
    });


    describe('Keyboard handling', () => {
      let getEventMock;

      beforeEach(function () {
        getEventMock = keyboardKey => Object.assign({
          key: keyboardKey,
          preventDefault: this.sinon.spy(),
          target: {
            matches: () => true
          }
        });

        this.sinon.spy(this.tagsInput, 'onRemoveTag');
      });

      it('Should remove last tag on pressing backspace if input is empty', function () {
        this.tagsInput.getInputNode().value = '';
        this.tagsInput.handleKeyDown(getEventMock('Backspace'));

        this.tagsInput.onRemoveTag.should.have.been.calledWith(fakeTags[0]);
      });

      it('Should not tag on pressing backspace if input is not empty', function () {
        this.tagsInput.getInputNode().value = 'entered value';
        this.tagsInput.handleKeyDown(getEventMock('Backspace'));

        this.tagsInput.onRemoveTag.should.not.have.been.called;
      });

      it('should remove tag with DELETE key if tag is focused', function () {
        this.tagsInput.setState({
          activeIndex: 0
        });
        this.tagsInput.handleKeyDown(getEventMock('Delete'));
        this.tagsInput.onRemoveTag.should.have.been.calledWith(fakeTags[0]);
      });

      it('should remove tag with BACKSPACE key if tag is focused', function () {
        this.tagsInput.rerender({
          activeIndex: 0
        });
        this.tagsInput.handleKeyDown(getEventMock('Backspace'));

        this.tagsInput.onRemoveTag.should.have.been.calledWith(fakeTags[0]);
      });

      it('should not remove tag with DELETE key if tag is not focused', function () {
        this.tagsInput.handleKeyDown(getEventMock('Delete'));
        this.tagsInput.onRemoveTag.should.not.have.been.called;
      });

      it('should not navigate to the first tag from select input', function () {
        this.sinon.spy(this.tagsInput, 'selectTag');
        this.tagsInput.getInputNode();
        this.tagsInput.caret = {
          getPosition: () => 1
        };
        this.tagsInput.handleKeyDown(getEventMock('ArrowLeft'));

        this.tagsInput.selectTag.should.not.have.been.called;
      });

      it('should navigate to the first tag from select input', function () {
        this.tagsInput.caret = {
          getPosition: this.sinon.spy()
        };
        this.tagsInput.handleKeyDown(getEventMock('ArrowLeft'));

        this.tagsInput.state.activeIndex.should.be.equals(0);
      });

      it('should navigate to the select input', function () {
        this.sinon.spy(this.tagsInput, 'setActiveIndex');
        this.tagsInput.rerender({
          activeIndex: 0
        });
        this.tagsInput.handleKeyDown(getEventMock('ArrowRight'));

        this.tagsInput.setActiveIndex.should.not.have.been.calledWith(undefined);
      });
    });
  });
});

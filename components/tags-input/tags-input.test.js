/* eslint-disable func-names */

import React from 'react';
import ReactDOM from 'react-dom';
import TagsInput from './tags-input';
import renderIntoDocument from 'render-into-document';
import RingComponent from '../ring-component/ring-component';

describe('TagsInput', () => {
  const fakeTags = [{key: 1, label: 'test1'}];

  beforeEach(function () {
    this.tagsInput = renderIntoDocument(React.createElement(TagsInput, {tags: fakeTags}));
  });

  describe('DOM', () => {
    it('should render tags', function () {
      this.tagsInput.node.should.contain('.ring-tag');
    });

    it('should render passed label inside tags', function () {
      this.tagsInput.node.querySelector('.ring-tag').textContent.should.be.equal('test1');
    });

    it('should render select in input mode', function () {
      this.tagsInput.node.should.contain('.ring-select_input-mode');
    });

    it('should render tag', function () {
      const renderedTag = this.tagsInput.renderTag(fakeTags[0]);
      const containerEl = document.createElement('div');
      ReactDOM.render(renderedTag, containerEl);

      containerEl.textContent.should.be.equal(fakeTags[0].label);
    });

    it('should render custom tag', function () {
      class CustomTag extends RingComponent {
        render() {
          return (<span className="custom-tag">{this.props.children}</span>);
        }
      }

      this.tagsInput.rerender({
        tags: [{key: 1, label: 'test3', rgTagIcon: 'bug'}],
        customTagComponent: CustomTag
      });

      this.tagsInput.node.should.contain('.custom-tag');
    });

    it('Should use passed className', function () {
      this.tagsInput.rerender({
        className: 'test-class'
      });
      this.tagsInput.node.should.have.class('test-class');
    });
  });

  it('Should add tag', function () {
    this.tagsInput.addTag({key: 2, label: 'test2'});
    this.tagsInput.state.tags.should.contain({key: 2, label: 'test2'});
  });

  it('Should remove tag', function () {
    return this.tagsInput.onRemoveTag(fakeTags[0]).then(() => {
      this.tagsInput.state.tags.should.be.empty;
    });
  });


  it('Should clear selected value after adding tag', function () {
    this.sinon.spy(this.tagsInput.refs.select, 'clear');
    this.tagsInput.addTag({key: 2, label: 'test2'});

    this.tagsInput.refs.select.clear.should.have.been.called;
  });

  it('Should clear select input after adding tag', function () {
    this.sinon.spy(this.tagsInput.refs.select, 'filterValue');
    this.tagsInput.addTag({key: 2, label: 'test2'});

    this.tagsInput.refs.select.filterValue.should.have.been.calledWith('');
  });

  it('Should copy tags to state on receiving props', function () {
    const newTags = [{key: 4, label: 'test5'}];

    this.tagsInput.updateStateFromProps({tags: newTags});
    this.tagsInput.state.tags.should.be.deep.equal(newTags);
  });

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

  it('Should turn on loading message immidiatelly after initialization', function () {
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

  it('Should drop exist tags from suggestions by key', function () {
    const notAddedSuggestions = this.tagsInput.filterExistTags([
      {key: 1, label: 'test1'},
      {key: 2, label: 'test2'}
    ]);

    notAddedSuggestions.should.be.deep.equal([{key: 2, label: 'test2'}]);
  });

  it('Should remove last tag on pressing backspace if input is empty', function () {
    this.sinon.spy(this.tagsInput, 'onRemoveTag');
    this.tagsInput._inputNode.value = '';
    this.tagsInput.handleBackspace();

    this.tagsInput.onRemoveTag.should.have.been.calledWith(fakeTags[0]);
  });

  it('Should not tag on pressing backspace if input is not empty', function () {
    this.sinon.spy(this.tagsInput, 'onRemoveTag');
    this.tagsInput._inputNode.value = 'entered value';
    this.tagsInput.handleBackspace();

    this.tagsInput.onRemoveTag.should.not.have.been.called;
  });
});

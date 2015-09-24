import React from 'react';
import ReactDOM from 'react-dom';
import TagsInput from './tags-input';
import {TagWithIcon} from './tags-input__tag';
import renderIntoDocument from 'render-into-document';
import $ from 'jquery';

describe('TagsInput', function() {
  let fakeTags = [{key: 1, label: 'test1'}];

  beforeEach(function () {
    this.tagsInput = renderIntoDocument(React.createElement(TagsInput, {tags: fakeTags}));
  });

  describe('DOM', function () {
    it('should render tags', function() {
      $(this.tagsInput.node).should.have.descendants('.tags-input__tag');
    });

    it('should render passed label inside tags', function() {
      this.tagsInput.node.querySelector('.tags-input__tag').textContent.should.be.equal('test1');
    });

    it('should render select in input mode', function() {
      $(this.tagsInput.node).should.have.descendants('.ring-select_input-mode');
    });

    it('should render tag', function () {
      let renderedTag = this.tagsInput.renderTag(fakeTags[0]);
      let containerEl = document.createElement('div');
      ReactDOM.render(renderedTag, containerEl);

      containerEl.textContent.should.be.equal(fakeTags[0].label);
    });

    it('should render custom tag', function () {
      this.tagsInput.rerender({
        tags: [{key: 1, label: 'test3', rgTagIcon: 'bug'}],
        customTagComponent: TagWithIcon
      });

      $(this.tagsInput.node).should.have.descendants('.tags-input__tag-icon')
    });
  });

  it('Should add tag', function () {
    this.tagsInput.addTag({key: 2, label: 'test2'});
    this.tagsInput.state.tags.should.contain({key: 2, label: 'test2'});
  });

  it('Should remove tag', function () {
    this.tagsInput.onRemoveTag(fakeTags[0]);
    this.tagsInput.state.tags.should.be.empty;
  });

  it('Should copy tags to state on receiving props', function () {
    let newTags = [{key: 4, label: 'test5'}];

    this.tagsInput.updateStateFromProps({tags: newTags});
    this.tagsInput.state.tags.should.be.deep.equal(newTags);
  });

  it('Should call datasource and set suggestions returned', function () {
    let suggestions = [{key: 1, label: 'suggestion 1'}];

    let dataSource = this.sinon.spy(() => Promise.resolve(suggestions));

    this.tagsInput.rerender({dataSource});

    this.sinon.spy(this.tagsInput, 'setState');
    this.tagsInput.selectOnFilter().then(() => {
      this.tagsInput.setState.should.have.been.calledWith({tags: suggestions});
    });
  });

  it('Should call datasource with query entered', function () {
    let dataSource = this.sinon.spy(() => Promise.resolve([]));
    this.tagsInput.rerender({dataSource});
    this.tagsInput.selectOnFilter('testquery');

    dataSource.should.have.been.calledWith('testquery');
  });

  it('Should drop exist tags from suggestions by key', function () {
    let notAddedSuggestions = this.tagsInput.filterExistTags([
      {key: 1, label: 'test1'},
      {key: 2, label: 'test2'}
    ]);

    notAddedSuggestions.should.be.deep.equal([{key: 2, label: 'test2'}]);
  });
});

/* eslint-disable func-names */

import React from 'react';
import ReactDOM from 'react-dom';
import {renderIntoDocument} from 'react-dom/test-utils';

import RingComponent from '../ring-component/ring-component';

import TagsList from './tags-list';

describe('Tags List', () => {
  const tagsMock = [{key: 1, label: 'test1'}];

  beforeEach(function () {
    this.tagsList = renderIntoDocument(React.createElement(TagsList, {tags: tagsMock}));
  });

  describe('DOM', () => {
    it('should render tags', function () {
      this.tagsList.node.should.contain('.ring-tag');
    });

    it('should render passed label inside tags', function () {
      this.tagsList.node.querySelector('.ring-tag').
        textContent.
        should.
        be.
        equal('test1');
    });

    it('should render tag', function () {
      const renderedTag = this.tagsList.renderTag(tagsMock[0]);
      const containerEl = document.createElement('div');
      ReactDOM.render(renderedTag, containerEl);

      containerEl.textContent.should.be.equal(tagsMock[0].label);
    });

    it('should render custom tag', function () {
      class CustomTag extends RingComponent {
        render() {
          return (<span className="custom-tag">{this.props.children}</span>);
        }
      }

      this.tagsList.rerender({
        tags: [{key: 1, label: 'test3', rgTagIcon: 'bug'}],
        customTagComponent: CustomTag
      });

      this.tagsList.node.should.contain('.custom-tag');
    });

    it('Should use passed className', function () {
      this.tagsList.rerender({
        className: 'test-class'
      });
      this.tagsList.node.should.have.class('test-class');
    });
  });
});

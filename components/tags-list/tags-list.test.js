/* eslint-disable func-names */

import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument} from 'react-dom/test-utils';

import TagsList from './tags-list';

describe('Tags List', () => {
  let tagsList;
  const tagsMock = [{key: 1, label: 'test1'}];
  const renderTagsList = props => renderIntoDocument(React.createElement(TagsList, props));

  beforeEach(() => {
    tagsList = renderTagsList({tags: tagsMock});
  });

  describe('DOM', () => {
    it('should render tags list', () => {
      findDOMNode(tagsList).should.match('[data-test="ring-tags-list"]');
    });

    it('should render passed label inside tags', () => {
      findDOMNode(tagsList).querySelector('.ring-tag').
        textContent.
        should.
        be.
        equal('test1');
    });

    it('should render custom tag', () => {
      class CustomTag extends Component {
        render() {
          return (<span data-test="custom-tag" className="custom-tag"/>);
        }
      }

      tagsList = renderTagsList({
        tags: tagsMock,
        customTagComponent: CustomTag
      });

      findDOMNode(tagsList).querySelector('.custom-tag').should.match('[data-test="custom-tag"]');
    });

    it('Should use passed className', () => {
      tagsList = renderTagsList({
        tags: tagsMock,
        className: 'test-class'
      });

      findDOMNode(tagsList).should.match('.test-class');
    });
  });
});

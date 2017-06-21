/* eslint-disable func-names */

import React from 'react';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument} from 'react-dom/test-utils';
import GroupIcon from 'jetbrains-icons/group.svg';

import Tag from './tag';


describe('Tag', () => {
  let tag;
  const tagMock = {key: 1, label: 'test1', rgTagIcon: GroupIcon};

  beforeEach(() => {
    tag = renderIntoDocument(React.createElement(Tag, tagMock));
  });

  it('should render tags', () => {
    findDOMNode(tag).should.match('[data-test="ring-tag"]');
  });

  it('should contains icon', () => {
    findDOMNode(tag).querySelector('.ring-tag__ring-icon').should.match('.ring-tag__ring-icon');
  });
});

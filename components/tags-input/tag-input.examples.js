import React from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import TagsInput from '../tags-input/tags-input';
import {CheckmarkIcon, ExceptionIcon, FrownIcon} from '../icon';

storiesOf('Components|Tags Input', module).
  addDecorator(reactDecorator()).
  add('basic', () => {
    function dataSource() {
      return new Promise(resolve => setTimeout(resolve, 200)).
        then(
          () => Promise.resolve(
            [...Array(20)].
              map((it, index) => ({key: `test${index}`, label: `test${index}`}))
          )
        );
    }

    return (
      <TagsInput
        className="test-additional-class"
        tags={[
          {key: 'test1', label: 'test1'},
          {key: 'test2', label: 'test2'}
        ]}
        maxPopupHeight={250}
        dataSource={dataSource}
        allowAddNewTags
        filter
      />
    );
  }).
  add('with icons', () => {
    const tags = [
      {key: 'test1', label: 'test1', rgTagIcon: CheckmarkIcon},
      {key: 'test2', label: 'test2'}
    ];

    function dataSource() {
      return [
        {key: 'test3', label: 'test3', rgTagIcon: ExceptionIcon, rgTagTitle: 'I am the tag title'},
        {key: 'test4', label: 'test4', rgTagIcon: FrownIcon}
      ];
    }

    return (
      <TagsInput
        tags={tags}
        dataSource={dataSource}
      />
    );
  }).
  add('disabled', () => (
    <TagsInput
      disabled
      tags={[{key: 'test2', label: 'test2'}]}
      dataSource={() => []}
    />
  )).
  add('with too long tag labels', () => {
    const tags = [
      {key: 'test1', label: 'Label'},
      {key: 'test2', label: 'Very long label'}
    ];

    function dataSource() {
      return [
        {key: 'test3', label: 'Very very long label'},
        {key: 'test4', label: 'Very very very long label'}
      ];
    }

    return (
      <TagsInput
        tags={tags}
        dataSource={dataSource}
      />
    );
  });

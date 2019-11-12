import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import {CheckmarkIcon} from '../icon/icons';

import Tag from './tag';

export default {
  title: 'Components|Tag',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a tag.'
  }
};

export const demo = () => {
  const avatarUrl =
    'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+ICAgIDxkZWZzPiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjEiPiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNENTBGNkIiIG9mZnNldD0iMCIvPiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNFNzNBRTgiIG9mZnNldD0iMSIvPiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4gICAgPC9kZWZzPiAgICA8Zz4gICAgICAgIDxyZWN0IGZpbGw9InVybCgjZ3JhZGllbnQpIiAgICAgICAgICAgICAgeD0iMCIgeT0iMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiAgICAgICAgICAgICAgcng9IjMiIHJ5PSIzIi8+ICAgICAgICA8dGV4dCB4PSI1IiB5PSIxOSIgICAgICAgICAgICAgIGZvbnQtZmFtaWx5PSJBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmIiAgICAgICAgICAgICAgZm9udC1zaXplPSIxNXB4IiAgICAgICAgICAgICAgbGV0dGVyLXNwYWNpbmc9IjEiICAgICAgICAgICAgICBmaWxsPSIjRkZGRkZGIj4gICAgICAgICAgICA8dHNwYW4+SkI8L3RzcGFuPiAgICAgICAgICAgIDx0c3BhbiB4PSI2IiB5PSIyOCI+XzwvdHNwYW4+ICAgICAgICA8L3RleHQ+ICAgIDwvZz48L3N2Zz4=';

  class TagDemo extends React.Component {
    render() {
      return (
        <div>
          <Tag>Simple</Tag>
          <Tag readOnly>Read-only</Tag>
          <Tag angled>With angle</Tag>
          <Tag angled className="limited-width">
            With angle and long truncated text
          </Tag>
          <Tag className="limited-width">With long truncated text</Tag>
          <Tag rgTagIcon={CheckmarkIcon} rgTagTitle="I am an icon title">
            With icon title
          </Tag>
          <Tag avatar={avatarUrl} readOnly={false}>
            With avatar
          </Tag>
        </div>
      );
    }
  }

  return <TagDemo/>;
};

demo.story = {
  name: 'demo'
};

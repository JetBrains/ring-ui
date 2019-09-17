import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import {CheckmarkIcon} from '../../components/icon/icons';

import hubConfig from '../../.storybook/hub-config';

import Tag from './tag';

export default {
  title: 'Components|Tag',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a tag.'
  }
};

export const demo = () => {
  const url = `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`;

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
          <Tag avatar={url} readOnly={false}>
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

import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import hubConfig from '../../.storybook/hub-config';

import Avatar, {Size} from './avatar';

export default {
  title: 'Components|Avatar',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays an avatar. In case of a loading error an empty square is displayed.'
  }
};

export const basic = () => {
  function Example() {
    const url = `${hubConfig.serverUri}/api/rest/avatar/default?username=Jet%20Brains`;
    const dataUri = `data:image/svg+xml,${encodeURIComponent(
      '<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">' +
        '<rect x="0" y="0" height="120" width="120" fill="#00cc00"/>' +
        '</svg>'
    )}`;

    return (
      <div>
        {Object.keys(Size).map(size => (
          <div className="avatar-demo" key={size}>
            <Avatar size={Size[size]} url={url}/>
            <Avatar size={Size[size]} url={dataUri} round/>
            <Avatar size={Size[size]}/>
          </div>
        ))}
      </div>
    );
  }

  return <Example/>;
};

basic.story = {
  name: 'basic',

  parameters: {
    storyStyles: `
  <style>
    .avatar-demo {
      display: flex;
      justify-content: space-between;
      width: 200px;
      margin-bottom: 16px;
    }
  </style>`
  }
};

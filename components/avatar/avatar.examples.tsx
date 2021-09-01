import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Avatar, {Size} from '@jetbrains/ring-ui/components/avatar/avatar';
import {avatarDataUri} from '@jetbrains/ring-ui/components/avatar/avatar-example-datauri';

export default {
  title: 'Components/Avatar',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays an avatar. In case of a loading error an empty square is displayed.'
  }
};

export const avatar = () => {
  function Example() {
    return (
      <div>
        {Object.entries(Size).map(([key, size]) => (typeof size === 'number'
          ? (
            <div className="avatar-demo" key={key}>
              <Avatar size={size} url={avatarDataUri}/>
              <Avatar size={size} username="Jet Brains"/>
              <Avatar size={size} username="Jet Brains" round/>
              <Avatar size={size}/>
            </div>
          )
          : null))}
      </div>
    );
  }

  return <Example/>;
};

avatar.parameters = {
  storyStyles: `
<style>
  .avatar-demo {
    display: flex;
    justify-content: space-between;
    width: 240px;
    margin-bottom: 16px;
  }
</style>`
};

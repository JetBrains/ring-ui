import warningIcon12 from '@jetbrains/icons/warning-12px';
import warningIcon20 from '@jetbrains/icons/warning-20px';

import avatarSrc from '../avatar-stack/avatar1.stories.png';

import Icon from '../icon';

import Avatar from './avatar';
import {Size} from './avatar-size';

export default {
  title: 'Components/Avatar',

  parameters: {
    notes: 'Displays an avatar. In case of a loading error an empty square is displayed.',
  },
};

export const avatar = () => {
  function Example() {
    return (
      <div>
        {[Size.Size16, Size.Size20, Size.Size24, Size.Size28, Size.Size32, Size.Size40, Size.Size56].map(size => {
          const warningIcon = size < 32 ? warningIcon12 : warningIcon20;
          return (
            <div className="avatar-demo" key={size}>
              Size {size}
              <div className="avatar-demo-cell">
                <Avatar size={size} url={avatarSrc} />
              </div>
              <div className="avatar-demo-cell">
                <Avatar size={size} username={`Samuel${size} Morse${size}`} />
              </div>
              <div className="avatar-demo-cell">
                <Avatar size={size} info="5" />
              </div>
              <div className="avatar-demo-cell">
                <Avatar size={size} info={<Icon glyph={warningIcon} />} />
              </div>
              <div className="avatar-demo-cell" />
              <div className="avatar-demo-cell">
                <Avatar size={size} url={avatarSrc} round />
              </div>
              <div className="avatar-demo-cell">
                <Avatar size={size} username={`Samuel${size} Morse${size}`} round />
              </div>
              <div className="avatar-demo-cell">
                <Avatar size={size} info="5" round />
              </div>
              <div className="avatar-demo-cell">
                <Avatar size={size} info={<Icon glyph={warningIcon} />} round />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return <Example />;
};

avatar.parameters = {
  storyStyles: `
<style>
  .avatar-demo {
    display: flex;
    gap: calc(var(--ring-unit) * 2);
    margin-bottom: 16px;
  }
  .avatar-demo > * {
    width: 56px;
  }
</style>`,
};

import Avatar, {Size} from '../avatar/avatar';
import AvatarStack from './avatar-stack';

import avatar1 from './avatar1.stories.png';
import avatar2 from './avatar2.stories.png';
import avatar3 from './avatar3.stories.png';
import avatar4 from './avatar4.stories.png';

export default {
  title: 'Components/Avatar Stack',
};

export const avatarStack = () =>
  [Size.Size20, Size.Size24, Size.Size28, Size.Size32, Size.Size40, Size.Size56].map(size => (
    <div key={size}>
      <AvatarStack
        size={size}
        extraItems={[
          {avatar: avatar4, label: 'Michael Peterson'},
          {showGeneratedAvatar: true, username: 'jane.doe', label: 'Jane Doe'},
        ]}
      >
        <Avatar size={size} url={avatar1} />
        <Avatar size={size} url={avatar2} />
        <Avatar size={size} url={avatar3} />
      </AvatarStack>
    </div>
  ));

export const noExtraItems = () => (
  <AvatarStack extraItems={[]}>
    <Avatar url={avatar1} />
    <Avatar url={avatar2} />
    <Avatar url={avatar3} />
  </AvatarStack>
);

export const withBackground = () => (
  <AvatarStack
    size={Size.Size56}
    extraItems={[
      {avatar: avatar4, label: 'Michael Peterson'},
      {showGeneratedAvatar: true, username: 'jane.doe', label: 'Jane Doe'},
    ]}
  >
    <Avatar size={Size.Size56} url={avatar1} />
    <Avatar size={Size.Size56} url={avatar2} />
    <Avatar size={Size.Size56} url={avatar3} />
  </AvatarStack>
);
withBackground.parameters = {
  storyStyles: `
    <style>
      body {
        background-color: var(--ring-secondary-background-color);
      }
    </style>
  `,
};

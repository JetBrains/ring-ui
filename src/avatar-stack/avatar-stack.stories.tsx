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
  [Size.Size20, Size.Size24, Size.Size28, Size.Size32, Size.Size40].map(size => (
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

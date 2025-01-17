import figma from '@figma/code-connect';

import Avatar, {Size} from './avatar';

figma.connect(
  Avatar,
  'https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI?m=auto&node-id=5990-522&t=v8bItK8qotmnbysK-1',
  {
    props: {
      round: figma.boolean('Round'),
      size: figma.enum('Size', {
        '20 px': Size.Size20,
        '24 px': Size.Size24,
        '28 px': Size.Size28,
        '32 px': Size.Size32,
        '40px': Size.Size40,
        '56px': Size.Size56,
      }),
      username: figma.enum('Content', {
        name: 'Samuel Morse',
      }),
      url: figma.enum('Content', {
        'color/image': 'avatar.png',
      }),
    },
    example: props => <Avatar {...props} />,
    imports: ['import Avatar, {Size} from "@jetbrains/ring-ui/components/avatar/avatar"'],
  },
);

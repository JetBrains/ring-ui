// url=https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI?node-id=18018-5431
// component=CollapsibleGroup
import figma from 'figma';

export default {
  id: 'CollapsibleGroup',
  metadata: {nestable: true},
  imports: [
    "import CollapsibleGroup from '@jetbrains/ring-ui/components/collapsible-group/collapsible-group'",
    "import Avatar, {Size as AvatarSize} from '@jetbrains/ring-ui/components/avatar/avatar'",
    "import Icon from '@jetbrains/ring-ui/components/icon/icon'",
    "import buildTypeIcon from '@jetbrains/icons/buildType-12px'",
  ],
  example: figma.code`<CollapsibleGroup
  title="Deployments"
  subtitle="Additional context"
  avatar={<Avatar size={AvatarSize.Size28} round info={<Icon glyph={buildTypeIcon} />} />}
  interactive={false}
/>`,
};

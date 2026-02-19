import classNames from 'classnames';
import figma from '@figma/code-connect';
import buildTypeIcon from '@jetbrains/icons/buildType-12px';

import Avatar, {Size as AvatarSize} from '../avatar/avatar';
import Icon from '../icon/icon';

import Expand from './expand';

import styles from './expand.figma.css';

const bodyText =
  "This is example of data that is showing in expand in body Here you can view all deployments, including their status, history, and associated resources. Filter by environment, region, or service to quickly find what you're looking for. Click on a deployment to view detailed logs and metrics.";

const Variants = () => (
  <div className={styles.variants}>
    <div className={styles.row}>
      <span className={styles.label}>{'Collapsed'}</span>
      <Expand
        className={classNames(styles.card, styles.cardCompact)}
        title={'Deployments'}
        subtitle={'Additional context'}
        avatar={<Avatar size={AvatarSize.Size28} round info={<Icon glyph={buildTypeIcon} />} />}
        interactive={false}
      >
        {null}
      </Expand>
    </div>
    <div className={styles.row}>
      <span className={styles.label}>{'Hover'}</span>
      <Expand
        className={classNames(styles.card, styles.cardCompact, styles.cardHover)}
        title={'Deployments'}
        subtitle={'Additional context'}
        avatar={<Avatar size={AvatarSize.Size28} round info={<Icon glyph={buildTypeIcon} />} />}
        interactive={false}
      >
        {null}
      </Expand>
    </div>
    <div className={styles.row}>
      <span className={styles.label}>{'Focus'}</span>
      <Expand
        className={classNames(styles.card, styles.cardCompact, styles.cardFocus)}
        title={'Deployments'}
        subtitle={'Additional context'}
        avatar={<Avatar size={AvatarSize.Size28} round info={<Icon glyph={buildTypeIcon} />} />}
        interactive={false}
      >
        {null}
      </Expand>
    </div>
    <div className={classNames(styles.row, styles.rowExpanded)}>
      <span className={classNames(styles.label, styles.labelExpanded)}>{'Expanded'}</span>
      <Expand
        className={classNames(styles.card, styles.cardExpanded, styles.cardHover)}
        title={'Deployments'}
        subtitle={'Additional context'}
        avatar={<Avatar size={AvatarSize.Size28} round info={<Icon glyph={buildTypeIcon} />} />}
        defaultExpanded
      >
        {bodyText}
      </Expand>
    </div>
  </div>
);

figma.connect(Expand, 'https://www.figma.com/design/HY6d4uE1xxaQXCMG9fe6Y2/RingUI?node-id=18022%3A2471', {
  example: () => <Variants />,
});

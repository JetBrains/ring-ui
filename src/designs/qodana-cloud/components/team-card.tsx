import Avatar, {Size} from '../../../avatar/avatar';
import Heading, {Levels} from '../../../heading/heading';
import Text from '../../../text/text';
import Island from '../../../island/island';

import {type QodanaTeam} from '../types';
import styles from '../qodana-cloud.css';

export interface TeamCardProps {
  team: QodanaTeam;
  onClick?: () => void;
}

export function TeamCard({team, onClick}: TeamCardProps) {
  const meta = `${team.projectCount} project${team.projectCount === 1 ? '' : 's'}, ${team.memberCount} member${
    team.memberCount === 1 ? '' : 's'
  }`;

  return (
    <Island className={styles.qodanaTeamCard} onClick={onClick} data-test={`team-card-${team.id}`}>
      <Avatar username={team.name} size={Size.Size32} round />
      <Heading className={styles.qodanaTeamCardTitle} level={Levels.H4}>
        {team.name}
      </Heading>
      <Text info size={Text.Size.S}>
        {meta}
      </Text>
    </Island>
  );
}

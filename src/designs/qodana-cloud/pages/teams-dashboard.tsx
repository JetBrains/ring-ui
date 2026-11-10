import {useState} from 'react';
import addIcon from '@jetbrains/icons/add-20px';
import changesIcon from '@jetbrains/icons/changes-20px';
import settingsIcon from '@jetbrains/icons/settings-20px';
import searchIcon from '@jetbrains/icons/search-20px';

import Button from '../../../button/button';
import Input, {Size} from '../../../input/input';
import Banner from '../../../banner/banner';

import {QodanaPageShell} from '../components/qodana-page-shell';
import {QodanaPageHeader} from '../components/qodana-page-header';
import {TeamCard} from '../components/team-card';
import {mockOrganization, mockTeams} from '../mock/teams';

import styles from '../qodana-cloud.css';

export function TeamsDashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInsightsBanner, setShowInsightsBanner] = useState(true);

  const {name, visibility, teamCount, memberCount} = mockOrganization;
  const subtitle = `${teamCount} teams, ${memberCount} members`;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleTeams = mockTeams.filter(team => team.name.toLowerCase().includes(normalizedQuery));

  return (
    <QodanaPageShell data-test='qodana-teams-dashboard'>
      <QodanaPageHeader
        title={name}
        subtitle={subtitle}
        visibilityLabel={visibility === 'private' ? 'Private' : 'Public'}
        actions={
          <>
            <Button primary icon={addIcon}>
              Create team
            </Button>
            <Button icon={changesIcon}>Insights</Button>
            <Button icon={settingsIcon}>Settings</Button>
          </>
        }
      />

      <div className={styles.qodanaSearchRow}>
        <Input
          size={Size.FULL}
          icon={searchIcon}
          placeholder='Search teams'
          value={searchQuery}
          onChange={event => setSearchQuery(event.currentTarget.value)}
          onClear={() => setSearchQuery('')}
        />
      </div>

      {showInsightsBanner && (
        <div className={styles.qodanaBannerRow}>
          <Banner mode='info' withIcon inline onClose={() => setShowInsightsBanner(false)}>
            <span>Check out the latest updates in Insights — new metrics and team comparisons are available.</span>
            <span className={styles.qodanaBannerActions}>
              <Button primary>Go to Insights</Button>
            </span>
          </Banner>
        </div>
      )}

      <div className={styles.qodanaTeamGrid}>
        {visibleTeams.map(team => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </QodanaPageShell>
  );
}

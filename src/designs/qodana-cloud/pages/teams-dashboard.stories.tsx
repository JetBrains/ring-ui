import {TeamsDashboardPage} from './teams-dashboard';

export default {
  title: 'Designs/Qodana Cloud/Pages/Teams dashboard',

  parameters: {
    layout: 'fullscreen',
    screenshots: {captureSelector: '*[data-test="qodana-teams-dashboard"]'},
    storyStyles: `
<style>
  body {
    margin: 0 !important;
  }
</style>`,
  },
};

export const teamsDashboard = () => <TeamsDashboardPage />;

teamsDashboard.storyName = 'Teams dashboard';

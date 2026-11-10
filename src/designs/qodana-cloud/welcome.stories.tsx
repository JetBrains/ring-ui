import Link from '../../link/link';
import Heading, {Levels} from '../../heading/heading';
import Text from '../../text/text';

import styles from './qodana-cloud.css';

export default {
  title: 'Designs/Qodana Cloud',

  parameters: {
    layout: 'fullscreen',
    screenshots: {skip: true},
    storyStyles: `
<style>
  body {
    margin: 0 !important;
  }
</style>`,
  },
};

export const welcome = () => (
  <div className={styles.qodanaPage}>
    <div className={styles.qodanaWelcome}>
      <Heading level={Levels.H2}>Qodana Cloud design gallery</Heading>
      <Text>
        This folder holds prompt-driven design prototypes for Qodana Cloud. Each story composes Ring UI components with
        mock data so designers can review real UI without running production code.
      </Text>
      <Heading level={Levels.H4}>Available screens</Heading>
      <ul className={styles.qodanaWelcomeList}>
        <li>
          <Link href='/?path=/story/designs-qodana-cloud-pages-teams-dashboard--teams-dashboard'>
            Teams dashboard
          </Link>
        </li>
      </ul>
      <Heading level={Levels.H4}>Adding a new screen</Heading>
      <Text info>
        Ask Cursor to create a new file under <code>src/designs/qodana-cloud/pages/</code> and a matching{' '}
        <code>.stories.tsx</code> entry. Reuse <code>QodanaPageShell</code>, <code>QodanaPageHeader</code>, and mock
        data from <code>mock/</code>.
      </Text>
    </div>
  </div>
);

welcome.storyName = 'Welcome';

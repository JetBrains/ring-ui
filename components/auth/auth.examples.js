import {storiesOf} from '@storybook/html';
import {action} from '@storybook/addon-actions';

import Auth from '../auth/auth';
import IFrameFlow from '../auth/iframe-flow';
import authDialogService from '../auth-dialog-service/auth-dialog-service';
import LandingEntryFileName from '../auth/landing-entry';
import hubConfig from '../../.storybook/hub-config';
import '../link/link__legacy.css';

storiesOf('Utilities|Auth', module).
  add('Authorization', () => {
    const log = action('auth-log');

    const auth = new Auth(hubConfig);
    auth.setAuthDialogService(authDialogService);

    const node = document.createElement('div');
    node.innerHTML = '<a href="javascript:void(0)" id="force-update" class="ring-link">Force token update</a>';

    (async () => {
      try {
        const location = await auth.init();
        log('Location to restore:', location);
        const token = await auth.requestToken();
        log('Token:', token);
        const data = await auth.requestUser();
        log('User profile data:', data);
      } catch (e) {
        log('error', e.toString());
        // eslint-disable-next-line no-console
        console.error('Auth error', e);
      }

      const forceUpdateLink = node.querySelector('#force-update');

      forceUpdateLink.addEventListener('click', async () => {
        const newToken = await auth.forceTokenUpdate();
        log('Token has been refreshed:', newToken);
      });
    })();

    return node;
  }).
  add('Authorization in IFrame', () => {
    const node = document.createElement('div');

    const auth = new Auth({
      ...hubConfig,
      EmbeddedLoginFlow: IFrameFlow
    });
    auth.setAuthDialogService(authDialogService);

    (async () => {
      try {
        const location = await auth.init();
        action('auth')(location);
        await auth.login();
        const data = await auth.requestUser();
        node.innerHTML = JSON.stringify(data);
      } catch (e) {
        action('auth-error')('Failed', e.toString());
      }
    })();

    return node;
  }).
  add('Auth landing page', () => {
    const log = action('auth-log');
    const node = document.createElement('div');
    node.innerHTML = `
      <div id="example">
        <div><a href="#" id="open-link" class="ring-link">Open landing page</a></div>
        <div><a href="#" id="force-update" class="ring-link">Force token update</a></div>
        <div><a href="#" id="log-out" class="ring-link">Log out</a></div>
        <div id="example"></div>
      </div>
    `;

    async function run() {
      const auth = new Auth(hubConfig);

      auth.setAuthDialogService(authDialogService);
      await auth.init();

      const user = await auth.requestUser();
      log('Logged in as:', user.name);

      node.querySelector('#open-link').href = LandingEntryFileName;

      node.querySelector('#force-update').addEventListener('click', async () => {
        const newToken = await auth.forceTokenUpdate();
        log('New token:', newToken);
      });

      node.querySelector('#log-out').addEventListener('click', () => {
        auth.login();
      });
    }

    run();

    return node;
  });

import {storiesOf} from '@storybook/html';
import {action} from '@storybook/addon-actions';

import Auth from '../auth/auth';
import authDialogService from '../auth-dialog-service/auth-dialog-service';
import hubConfig from '../../packages/docs/components/hub-config';
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
  });

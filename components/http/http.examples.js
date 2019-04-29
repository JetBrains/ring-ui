import {storiesOf} from '@storybook/html';

import hubConfig from '../../.storybook/hub-config';
import Auth from '../auth/auth';
import HTTP from '../http/http';


storiesOf('Utilities|HTTP service', module).
  addParameters({hermione: {skip: true}}).
  add('basic', () => {
    const node = document.createElement('div');
    node.innerHTML = '<div id="output">Fetching user using HTTP service...</div>';

    const auth = new Auth(hubConfig);
    const http = new HTTP(auth);

    (async function initializeExample() {
      await auth.init();

      const user = await http.get(`${hubConfig.serverUri}/api/rest/users/me?fields=name,login`);

      node.querySelector('#output').innerText = JSON.stringify(user);
    }());

    return node;
  });

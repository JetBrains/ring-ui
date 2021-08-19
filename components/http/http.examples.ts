import hubConfig from '../../.storybook/hub-config';

import Auth from '@jetbrains/ring-ui/components/auth/auth';

import HTTP from '@jetbrains/ring-ui/components/http/http';

export default {
  title: 'Utilities/HTTP service',

  parameters: {
    notes: 'Provides a way to perform authorized network requests.',
    hermione: {skip: true}
  }
};

export const basic = () => {
  const node = document.createElement('div');
  node.innerHTML = '<div id="output">Fetching user using HTTP service...</div>';

  const auth = new Auth(hubConfig);
  const http = new HTTP(auth);

  (async function initializeExample() {
    await auth.init();

    const user = await http.get(`${hubConfig.serverUri}/api/rest/users/me?fields=name,login`);

    const output = node.querySelector<HTMLElement>('#output');
    if (output != null) {
      output.innerText = JSON.stringify(user);
    }
  }());

  return node;
};

basic.storyName = 'HTTP service';

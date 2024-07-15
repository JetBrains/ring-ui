import {useEffect, useState} from 'react';

import hubConfig from '../../.storybook/hub-config';

import Auth from '../auth/auth';

import HTTP from './http';

export default {
  title: 'Utilities/HTTP service',

  parameters: {
    notes: 'Provides a way to perform authorized network requests.',
    screenshots: {skip: true}
  },
  tags: ['skip-test']
};

export const Basic = () => {
  const [output, setOutput] = useState('Fetching user using HTTP service...');

  useEffect(() => {
    const auth = new Auth(hubConfig);
    const http = new HTTP(auth);

    (async function initializeExample() {
      await auth.init();

      const user = await http.get(`${hubConfig.serverUri}/api/rest/users/me?fields=name,login`);

      setOutput(JSON.stringify(user));
    }());
  }, []);

  return <div id="output">{output}</div>;
};

Basic.storyName = 'HTTP service';

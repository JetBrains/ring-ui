/* eslint-disable no-console */
import React, {useState} from 'react';

import hubConfig from '../../.storybook/hub-config';

import authDialogService from '../auth-dialog-service/auth-dialog-service';
import Link from '../link/link';

import Auth from './auth';
import IFrameFlow from './iframe-flow';
import LandingEntryFileName from './landing-entry';

import '../link/link__legacy.css';


export default {
  title: 'Utilities/Auth',

  parameters: {
    notes: 'Authenticates a user in [Hub](https://www.jetbrains.com/hub/).',
    hermione: {skip: true}
  }
};

export const basic = () => {
  const auth = new Auth(hubConfig);
  auth.setAuthDialogService(authDialogService);

  (async () => {
    try {
      const location = await auth.init();
      console.log('Location to restore:', location);
      const token = await auth.requestToken();
      console.log('Token:', token);
      const data = await auth.requestUser();
      console.log('User profile data:', data);
    } catch (e) {
      if (!(e instanceof Error)) {
        throw e;
      }
      console.error('Auth error', e);
    }
  })();

  return (
    <Link
      pseudo
      onClick={async () => {
        const newToken = await auth.forceTokenUpdate();
        console.log('Token has been refreshed:', newToken);
      }}
    >Force token update</Link>
  );
};

basic.storyName = 'basic';

export const InIFrame = () => {
  const [data, setData] = useState('');

  const auth = new Auth({
    ...hubConfig,
    EmbeddedLoginFlow: IFrameFlow
  });
  auth.setAuthDialogService(authDialogService);

  (async () => {
    try {
      const location = await auth.init();
      console.log(location);
      await auth.login();
      setData(await auth.requestUser());
    } catch (e) {
      if (!(e instanceof Error)) {
        throw e;
      }
      console.error('Failed', e);
    }
  })();

  return <div dangerouslySetInnerHTML={{__html: data}}/>;
};

InIFrame.storyName = 'in IFrame';

export const landingPage = () => {
  const node = document.createElement('div');
  node.innerHTML = `
      <div id="example">
        <div><a href="#" id="open-link" class="ring-link">Open landing page</a></div>
        <div><a href="#" id="force-update" class="ring-link">Force token update</a></div>
        <div><a href="#" id="log-out" class="ring-link">Log out</a></div>
        <div id="example-2"></div>
      </div>
    `;

  const auth = new Auth(hubConfig);
  async function run() {
    auth.setAuthDialogService(authDialogService);
    await auth.init();

    const user = await auth.requestUser();
    console.log('Logged in as:', user.name);
  }

  run();

  return (
    <div id="example">
      <div><Link href={LandingEntryFileName}>Open landing page</Link></div>
      <div>
        <Link
          pseudo
          onClick={async () => {
            const newToken = await auth.forceTokenUpdate();
            console.log('New token:', newToken);
          }}
        >Force token update</Link>
      </div>
      <div>
        <Link
          pseudo
          onClick={() => {
            auth.login();
          }}
        >Log out</Link>
      </div>
      <div id="example-2"/>
    </div>
  );
};

landingPage.storyName = 'landing page';

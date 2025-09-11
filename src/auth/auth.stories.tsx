/* eslint-disable no-console */
import {useState} from 'react';

import hubConfig from '../../.storybook/hub-config';
import authDialogService from '../auth-dialog-service/auth-dialog-service';
import Link from '../link/link';
import Auth from './auth';
import IFrameFlow from './iframe-flow';

export default {
  title: 'Utilities/Auth',

  parameters: {
    notes: 'Authenticates a user in [Hub](https://www.jetbrains.com/hub/).',
    screenshots: {skip: true},
  },
  tags: ['skip-test'],
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
    >
      Force token update
    </Link>
  );
};

basic.storyName = 'basic';

export const InIFrame = () => {
  const [data, setData] = useState('');

  const auth = new Auth({
    ...hubConfig,
    EmbeddedLoginFlow: IFrameFlow,
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

  return <div dangerouslySetInnerHTML={{__html: data}} />;
};

InIFrame.storyName = 'in IFrame';

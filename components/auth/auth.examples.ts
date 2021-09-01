import hubConfig from '../../.storybook/hub-config';

import authDialogService from '@jetbrains/ring-ui/components/auth-dialog-service/auth-dialog-service';


import Auth from '@jetbrains/ring-ui/components/auth/auth';
import IFrameFlow from '@jetbrains/ring-ui/components/auth/iframe-flow';
import LandingEntryFileName from '@jetbrains/ring-ui/components/auth/landing-entry';

import '@jetbrains/ring-ui/components/link/link__legacy.css';

export default {
  title: 'Utilities/Auth',

  parameters: {
    notes: 'Authenticates a user in [Hub](https://www.jetbrains.com/hub/).',
    hermione: {skip: true}
  }
};

interface BasicProps {
  onAuthLog: (...args: unknown[]) => void
}
export const basic = ({onAuthLog}: BasicProps) => {
  const auth = new Auth(hubConfig);
  auth.setAuthDialogService(authDialogService);

  const node = document.createElement('div');
  node.innerHTML =
    '<a href="javascript:void(0)" id="force-update" class="ring-link">Force token update</a>';

  (async () => {
    try {
      const location = await auth.init();
      onAuthLog('Location to restore:', location);
      const token = await auth.requestToken();
      onAuthLog('Token:', token);
      const data = await auth.requestUser();
      onAuthLog('User profile data:', data);
    } catch (e) {
      if (!(e instanceof Error)) {
        throw e;
      }
      onAuthLog('error', e.toString());
      // eslint-disable-next-line no-console
      console.error('Auth error', e);
    }

    const forceUpdateLink = node.querySelector('#force-update');

    forceUpdateLink?.addEventListener('click', async () => {
      const newToken = await auth.forceTokenUpdate();
      onAuthLog('Token has been refreshed:', newToken);
    });
  })();

  return node;
};

basic.storyName = 'basic';
basic.argTypes = {onAuthLog: {}};

interface InIframeProps {
  onAuth: (...args: unknown[]) => void
  onAuthError: (...args: unknown[]) => void
}
export const inIFrame = ({onAuth, onAuthError}: InIframeProps) => {
  const node = document.createElement('div');

  const auth = new Auth({
    ...hubConfig,
    EmbeddedLoginFlow: IFrameFlow
  });
  auth.setAuthDialogService(authDialogService);

  (async () => {
    try {
      const location = await auth.init();
      onAuth(location);
      await auth.login();
      const data = await auth.requestUser();
      node.innerHTML = JSON.stringify(data);
    } catch (e) {
      if (!(e instanceof Error)) {
        throw e;
      }
      onAuthError('Failed', e.toString());
    }
  })();

  return node;
};

inIFrame.storyName = 'in IFrame';
inIFrame.argTypes = {onAuth: {}, onAuthError: {}};

interface LandingPageProps {
  onAuthLog: (...args: unknown[]) => void
}
export const landingPage = ({onAuthLog}: LandingPageProps) => {
  const node = document.createElement('div');
  node.innerHTML = `
      <div id="example">
        <div><a href="#" id="open-link" class="ring-link">Open landing page</a></div>
        <div><a href="#" id="force-update" class="ring-link">Force token update</a></div>
        <div><a href="#" id="log-out" class="ring-link">Log out</a></div>
        <div id="example-2"></div>
      </div>
    `;

  async function run() {
    const auth = new Auth(hubConfig);

    auth.setAuthDialogService(authDialogService);
    await auth.init();

    const user = await auth.requestUser();
    onAuthLog('Logged in as:', user.name);

    const openLink = node.querySelector<HTMLAnchorElement>('#open-link');
    if (openLink != null) {
      openLink.href = LandingEntryFileName;
    }

    node.querySelector('#force-update')?.addEventListener('click', async () => {
      const newToken = await auth.forceTokenUpdate();
      onAuthLog('New token:', newToken);
    });

    node.querySelector('#log-out')?.addEventListener('click', () => {
      auth.login();
    });
  }

  run();

  return node;
};

landingPage.storyName = 'landing page';
landingPage.argTypes = {onAuthLog: {}};

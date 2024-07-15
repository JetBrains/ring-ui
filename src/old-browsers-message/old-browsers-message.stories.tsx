import './old-browsers-message.css';
import {useEffect} from 'react';

import {stop} from './old-browsers-message';

export default {
  title: 'Style-only/Old Browsers Message',

  parameters: {
    notes: `
Displays a full-screen "Browser is unsupported" message if a JavaScript error occurs on page load in an old browser.

Note: this script does not have any dependencies, you should include it directly.
Once loaded, it attaches a global error handler. When your app finishes loading you should probably turn it off by calling oldBrowserMessage.stop();
    `
  }
};

function triggerGlobalError() {
  // @ts-expect-error testing a runtime error
  Object.unknownMethodToTriggerOldBrowsersMessage();
  setTimeout(stop);
}

export const Basic = () => {
  useEffect(() => {
    setTimeout(triggerGlobalError);
  }, []);

  return (
    <div id="ring-old-browsers-message" className="ring-old-browsers-message ring-old-browsers-message_hidden" hidden>
      <span id="ring-old-browsers-message__smile" className="ring-old-browsers-message__smile">{'{{ (>_<) }}'}</span>
      <br/><br/>
      <span id="ring-old-browsers-message__browser-message">This version of your browser is not <a href="https://documentation.link">supported</a>.<br/>
        Try upgrading to the latest stable version.</span>
      <span id="ring-old-browsers-message__error-message">Something went seriously wrong.</span>
      <br/><br/>
    </div>
  );
};

Basic.storyName = 'Old Browsers Message';

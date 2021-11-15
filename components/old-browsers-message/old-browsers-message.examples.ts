import '@jetbrains/ring-ui/components/old-browsers-message/old-browsers-message.css';
import {stop} from '@jetbrains/ring-ui/components/old-browsers-message/old-browsers-message';

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

export const basic = () => {
  function triggerGlobalError() {
    // @ts-expect-error testing a runtime error
    Object.unknownMethodToTriggerOldBrowsersMessage();
    setTimeout(stop);
  }

  setTimeout(triggerGlobalError);

  return `
      <div id="ring-old-browsers-message" class="ring-old-browsers-message ring-old-browsers-message_hidden" hidden>
        <span id="ring-old-browsers-message__smile" class="ring-old-browsers-message__smile">{{ (&gt;_&lt;) }}</span>
        <br/><br/>
        <span id="ring-old-browsers-message__browser-message">This version of your browser is not <a href="https://documentation.link">supported</a>.<br/>
        Try upgrading to the latest stable version.</span>
        <span id="ring-old-browsers-message__error-message">Something went seriously wrong.</span>
        <br/><br/>
      </div>
    `;
};

basic.storyName = 'Old Browsers Message';

import {storiesOf} from '@storybook/html';

import '../old-browsers-message/old-browsers-message.css';
import '../old-browsers-message/old-browsers-message';

storiesOf('Style-only|Old Browsers Message', module).
  add('basic', () => {
    function triggerGlobalError() {
      Object.unknownMethodToTriggerOldBrowsersMessage();
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
  });

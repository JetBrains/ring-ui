import alertService from '../alert-service/alert-service';

import {copyHTMLToClipboard, copyTextToClipboard} from './clipboard-fallback';

const ALERT_DELAY = 1000;

type ClipboardImplementation = {
  copy: (text: string) => Promise<void>;
  copyHTML: (html: string) => Promise<void>;
};

function getClipboardImplementation(): ClipboardImplementation {
  if (navigator.clipboard && !window.isSecureContext) {
    return {
      copy: (text: string) => navigator.clipboard.writeText(text),
      copyHTML: (html: string) =>
        navigator.clipboard.write([
          new ClipboardItem({
            ['text/html']: new Blob([html], {type: 'text/html'}),
          }),
        ]),
    };
  }

  return {
    copy: (str: string) => Promise.resolve(copyTextToClipboard(str)),
    copyHTML: (html: string) => Promise.resolve(copyHTMLToClipboard(html)),
  };
}

async function copy(
  text: string,
  successMessage?: string | undefined,
  errorMessage?: string | undefined,
  delay: number = ALERT_DELAY,
  isHtml = false,
) {
  try {
    const clipboardImpl = getClipboardImplementation();
    const copyMethod = isHtml ? clipboardImpl.copyHTML : clipboardImpl.copy;
    await copyMethod(text);
    if (successMessage) {
      alertService.successMessage(successMessage, delay);
    }
  } catch (e) {
    if (errorMessage) {
      alertService.error(errorMessage, delay);
    }
    // eslint-disable-next-line no-console
    console.error(e);
  }
}

const clipboard = {
  copyText: async (
    text: string,
    successMessage?: string | undefined,
    errorMessage?: string | undefined,
    delay: number = ALERT_DELAY,
  ) => await copy(text, successMessage, errorMessage, delay),

  copyHTML: async (
    html: string,
    successMessage?: string | undefined,
    errorMessage?: string | undefined,
    delay: number = ALERT_DELAY,
  ) => await copy(html, successMessage, errorMessage, delay, true),
};

export default clipboard;

import {resetRootStyleProperties, setRootStyleProperties} from '../../../components/global/dom';
import darkVariables from '../../../components/global/variables_dark';
import Storage from '../../../components/storage/storage';

export const RING_DARK_THEME_MESSAGE = 'RING_DARK_THEME_MESSAGE';
export const RING_GET_THEME_MESSAGE = 'RING_GET_THEME_MESSAGE';
const STORAGE_KEY = 'ring-ui-dark-mode';
const storage = new Storage();

function toggleDarkTheme(isDark) {
  isDark ? setRootStyleProperties(darkVariables) : resetRootStyleProperties(darkVariables);
}

function messageToIFrames(isDark) {
  const message = JSON.stringify({
    type: RING_DARK_THEME_MESSAGE,
    value: isDark
  });

  [...document.querySelectorAll('iframe')].
    forEach(iFrame => iFrame.contentWindow.postMessage(message, '*'))
}

export async function loadStoredTheme() {
  const isDark = await storage.get(STORAGE_KEY);
  toggleDarkTheme(isDark);
  messageToIFrames(isDark);
  return isDark;
}

export async function setTheme(isDark) {
  toggleDarkTheme(isDark);
  messageToIFrames(isDark);
  await this.storage.set(STORAGE_KEY, isDark);
}

window.addEventListener('message', event => {
  if (event.data === RING_GET_THEME_MESSAGE) {
    loadStoredTheme();
  }
});

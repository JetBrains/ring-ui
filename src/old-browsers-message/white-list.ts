import sniffer from '../global/sniffer';

const MAJOR_VERSION_INDEX = 0;

declare const SUPPORTED_BROWSERS: string[] | undefined;

/**
 * SUPPORTED_BROWSERS are defined by Babel plugin, see babel config
 */
if (!SUPPORTED_BROWSERS) {
  // eslint-disable-next-line no-console
  console.warn('Ring UI: no SUPPORTED_BROWSERS passed. Please check babel config.');
}
const SUPPORTED = SUPPORTED_BROWSERS || [];

const WHITE_LISTED_BROWSERS = ['chrome', 'firefox', 'safari', 'edge'];

export const WHITE_LIST = SUPPORTED.reduce((acc: Record<string, number>, item) => {
  const [, browserName, version] = item.match(/(\S+)\s(\S+)/) ?? [];
  if (!WHITE_LISTED_BROWSERS.includes(browserName)) {
    return acc;
  }

  return {
    ...acc,
    [browserName]: parseInt(version, 10),
  };
}, {});

export function isBrowserInWhiteList() {
  return sniffer.browser.version[MAJOR_VERSION_INDEX] >= WHITE_LIST[sniffer.browser.name];
}

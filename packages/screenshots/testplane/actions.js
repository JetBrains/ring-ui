const TIMEOUT = 1000;

module.exports = {
  async capture(browser, {name, selector}) {
    const selectors = Array.isArray(selector) ? selector : [selector];
    await Promise.all(
      selectors.map(async selectorString => {
        const element = await browser.$(selectorString);
        return element.waitForDisplayed({timeout: TIMEOUT});
      })
    );
    await browser.assertView(name.toLowerCase(), selector);
  },
  click: async (browser, {selector}) => {
    const element = await browser.$(selector);
    return element.click();
  },
  executeJS: (browser, {script}) => browser.execute(script),
  focus: (browser, {selector}) =>
    browser.execute(`document.querySelector('${selector}').focus()`),
  mouseMove: async (browser, {selector, x, y}) => {
    const element = await browser.$(selector);
    return element.moveTo({xOffset: x, yOffset: y});
  },
  mouseEvent: (browser, {selector, eventname}) =>
    browser.execute(
      `document.querySelector('${selector}').dispatchEvent(new MouseEvent('${eventname}'))`
    ),
  sendKeys: async (browser, {selector, value}) => {
    const element = await browser.$(selector);
    return element.addValue(value);
  },
  scroll: (browser, {selector, x, y}) =>
    browser.execute(
      `var element = document.querySelector('${selector}');
      ${y && `element.scrollTop += ${y};`}
      ${x && `element.scrollLeft += ${x};`}`
    ),
  setWindowSize: (browser, {width, height}) =>
    browser.setWindowSize(width, height),
  waitForElementToShow: async (browser, {timeout, selector, hidden}) => {
    const element = await browser.$(selector);
    return element.waitForDisplayed({timeout, reverse: hidden});
  },
  waitForJSCondition: (browser, {condition}) =>
    browser.waitUntil(() => browser.execute(condition)),
  wait: (_, {delay}) => new Promise(resolve => setTimeout(resolve, delay)),
  setDarkTheme: browser => browser.execute(() => {
    document.documentElement.classList.add('ring-ui-theme-dark');
    document.body.classList.add('ring-ui-theme-dark');
  })
};

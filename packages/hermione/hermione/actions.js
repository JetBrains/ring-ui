module.exports = {
  capture: (browser, {name, selector}) =>
    browser.assertView(name.toLowerCase(), selector),
  click: (browser, {selector}) => browser.click(selector),
  executeJS: (browser, {script}) => browser.execute(script),
  focus: (browser, {selector}) =>
    browser.execute(`document.querySelector('${selector}').focus()`),
  mouseMove: (browser, {selector, x, y}) => browser.moveTo(selector, x, y),
  mouseEvent: (browser, {selector, eventname}) =>
    browser.execute(
      `document.querySelector('${selector}').dispatchEvent(new MouseEvent('${eventname}'))`
    ),
  sendKeys: (browser, {selector, value}) => browser.addValue(selector, value),
  scroll: (browser, {selector, x, y}) =>
    browser.execute(
      `var element = document.querySelector('${selector}');
      ${y && `element.scrollTop += ${y};`}
      ${x && `element.scrollLeft += ${x};`}`
    ),
  setWindowSize: (browser, {width, height}) =>
    browser.setWindowSize(width, height),
  waitForElementToShow: (browser, {timeout, selector, hidden}) =>
    browser.waitForVisible(selector, timeout, hidden),
  waitForJSCondition: (browser, {condition}) =>
    browser.waitUntil(() => browser.execute(condition)),
  wait: (_, {delay}) => new Promise(resolve => setTimeout(resolve, delay))
};

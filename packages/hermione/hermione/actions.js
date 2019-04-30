module.exports = {
  capture: (browser, {name, selector}) =>
    browser.assertView(name.toLowerCase(), selector),
  click: (browser, {selector}) => browser.click(selector),
  executeJS: (browser, {script}) => browser.execute(script),
  focus: (browser, {selector}) =>
    browser.execute(`document.querySelector(${selector}).focus()`),
  mouseMove: (browser, {selector, x, y}) => browser.moveTo(selector, x, y),
  sendKeys: (browser, {selector, value}) => browser.addValue(selector, value),
  setWindowSize: (browser, {width, height}) =>
    browser.setWindowSize(width, height),
  waitForElementToShow: (browser, {timeout, selector, hidden}) =>
    browser.waitForDisplayed(timeout, selector, hidden),
  waitForJSCondition: (browser, {condition}) =>
    browser.waitUntil(() => browser.execute(condition)),
  wait: (_, {delay}) => new Promise(resolve => setTimeout(resolve, delay))
};

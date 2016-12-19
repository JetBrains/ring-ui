/* global gemini: false */

const large = {
  width: 1100,
  height: 600
};

const middle = {
  width: 700,
  height: 500
};

gemini.suite('Grid', suite => {
  suite.
    setUrl('/example-simple-grid/').
    setCaptureElements('#grid-simple').
    capture('grid-simple-middle', actions => actions.setWindowSize(middle.width, middle.height)).
    capture('grid-simple-large', actions => actions.setWindowSize(large.width, large.height));
});

/* global gemini: false */

const large = {
  width: 1250,
  height: 600
};

const middle = {
  width: 1000,
  height: 600
};

const small = {
  width: 700,
  height: 600
};

const extraSmall = {
  width: 500,
  height: 600
};

gemini.suite('Grid', suite => {
  suite.
    setUrl('/example-simple-grid/').
    setCaptureElements('#grid-simple').
    capture('grid-simple-extra-small', actions => actions.setWindowSize(extraSmall.width, extraSmall.height)).
    capture('grid-simple-small', actions => actions.setWindowSize(small.width, small.height)).
    capture('grid-simple-middle', actions => actions.setWindowSize(middle.width, small.height)).
    capture('grid-simple-large', actions => actions.setWindowSize(large.width, small.height));
});

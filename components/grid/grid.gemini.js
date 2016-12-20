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

gemini.suite('Grid', () => {
  gemini.suite('Responsive', child => {
    child.
      setUrl('/example-responsive-grid/').
      setCaptureElements('#grid').
      capture('grid-extra-small', actions => actions.setWindowSize(extraSmall.width, extraSmall.height)).
      capture('grid-small', actions => actions.setWindowSize(small.width, small.height)).
      capture('grid-middle', actions => actions.setWindowSize(middle.width, small.height)).
      capture('grid-large', actions => actions.setWindowSize(large.width, small.height));
  });

  gemini.suite('Offset', child => {
    child.
      setUrl('/example-grid-offset/').
      setCaptureElements('*[data-test="offset"]').
      capture('offset');
  });

  gemini.suite('Auto size', child => {
    child.
      setUrl('/example-grid-auto-size/').
      setCaptureElements('*[data-test="auto-size"]').
      capture('auto-size-xs', actions => actions.setWindowSize(extraSmall.width, extraSmall.height)).
      capture('auto-size-s', actions => actions.setWindowSize(small.width, small.height)).
      capture('auto-size-md', actions => actions.setWindowSize(middle.width, small.height));
  });

  gemini.suite('Alignment', child => {
    child.
      setUrl('/example-grid-alignment/').
      setCaptureElements('*[data-test="alignment"]').
      capture('alignment');
  });

  gemini.suite('Distribution', child => {
    child.
      setUrl('/example-grid-cols-distribution/').
      setCaptureElements('*[data-test="distribution"]').
      capture('distribution');
  });
});

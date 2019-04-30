import {storiesOf} from '@storybook/html';

import {getStyles, getRect, getPixelRatio, getWindowHeight} from '../global/dom';

storiesOf('Utilities|DOM', module).
  addParameters({hermione: {skip: true}}).
  add('basic', () => {
    const node = document.createElement('div');

    node.innerHTML = `
      <div id="rect-target" style="min-width: 200px"></div>
      <div id="report"></div>
    `;

    function calc() {
      const rectTarget = node.querySelector('#rect-target');
      rectTarget.innerHTML = `
        Element min-width = ${getStyles(rectTarget).minWidth} <br/>
        Element rect = ${JSON.stringify(getRect(rectTarget))} <br/>
      `;

      const report = node.querySelector('#report');
      report.innerHTML = `
       Pixel ratio = ${getPixelRatio()} <br/>
       Window height = ${getWindowHeight()} <br/>
      `;
    }

    setTimeout(calc);

    return node;
  });

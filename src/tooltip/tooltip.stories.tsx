import {CSSProperties, Fragment} from 'react';


import Button from '../button/button';

import Tooltip from './tooltip';

export default {
  title: 'Components/Tooltip',

  parameters: {
    notes: 'Displays a tooltip.',
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc71cc9f8daafc0afcfa'
  }
};

export const basic = () => (
  <div style={{paddingBottom: '100px'}}>
    <Tooltip title="Explanation">
      <Button id="button-with-tooltip">Button that requires an explanation</Button>
    </Tooltip>
  </div>
);

basic.storyName = 'basic';

basic.parameters = {
  screenshots: {
    actions: [
      {type: 'mouseEvent', selector: '[data-test~=ring-tooltip]', eventname: 'mouseover'},
      {type: 'wait', delay: 500},
      {type: 'capture', name: '', selector: '#storybook-root'}
    ]
  }
};

export const displayedWhenNecessary = () => {
  const loremIpsum =
    'Lorem ipsum dolor sit amet, vitae alienum prodesset vis ei, quando nullam ' +
    'oportere sea eu, vim an labore diceret docendi. Vim ne illud iusto feugait, ' +
    'sea laudem prompta accommodare eu, vidit noster efficiantur est id. Ex vide ' +
    'tollit necessitatibus est, eum no quas dicunt. Luptatum singulis usu ne, cu ' +
    'sit populo semper civibus. Tamquam dolorem qui ea, nec no dolor vidisse conceptam, ' +
    'an est ponderum eloquentiam.';

  const overflowStyles: CSSProperties = {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  return (
    <Fragment>
      <div style={{paddingBottom: '200px'}}>
        <Tooltip long title={loremIpsum} selfOverflowOnly className="lorem-ipsum__text">
          <b>{"Tooltip won't be displayed:"}</b> {loremIpsum}
        </Tooltip>
      </div>
      <div style={{paddingBottom: '200px'}}>
        <Tooltip
          long
          title={loremIpsum}
          selfOverflowOnly
          style={overflowStyles}
          className="lorem-ipsum__text_overflow"
        >
          <b>Tooltip will be displayed:</b> {loremIpsum}
        </Tooltip>
      </div>
    </Fragment>
  );
};

displayedWhenNecessary.storyName = 'displayed when necessary';

displayedWhenNecessary.parameters = {
  screenshots: {
    actions: [
      {type: 'mouseEvent', selector: '.lorem-ipsum__text', eventname: 'mouseover'},
      {type: 'capture', name: 'full text element', selector: '#storybook-root'},
      {type: 'mouseEvent', selector: '.lorem-ipsum__text_overflow', eventname: 'mouseover'},
      {type: 'capture', name: 'cut text element', selector: '#storybook-root'}
    ]
  }
};

export const nested = () => (
  <div style={{paddingBottom: '100px'}}>
    <Tooltip title="Explanation">
      Some text with an explanation.

      <Tooltip title="Nested Explanation">
        <strong> Some text inside with a separate explanation. </strong>

        <Tooltip title="Nested Nested Explanation">
          <Button id="button-with-tooltip">Inline button that requires an explanation too</Button>
        </Tooltip>

        <strong> Some text inside with a separate explanation. </strong>
      </Tooltip>

      Some text with an explanation.
    </Tooltip>
  </div>
);

nested.storyName = 'nested';

nested.parameters = {
  screenshots: {
    actions: [
      {type: 'mouseEvent', selector: '[data-test~=ring-tooltip]', eventname: 'mouseover'},
      {type: 'wait', delay: 500},
      {type: 'capture', name: '', selector: '#storybook-root'}
    ]
  }
};

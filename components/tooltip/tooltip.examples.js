import React, {Fragment} from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import Button from '@jetbrains/ring-ui/components/button/button';

import Tooltip from '@jetbrains/ring-ui/components/tooltip/tooltip';

export default {
  title: 'Components/Tooltip',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a tooltip.'
  }
};

export const basic = () => (
  <div style={{paddingBottom: '100px'}}>
    <Tooltip title="Explanation">
      <Button id="button-with-tooltip">Button that requires an explanation</Button>
    </Tooltip>
  </div>
);

basic.story = {
  name: 'basic',

  parameters: {
    hermione: {
      actions: [
        {type: 'mouseEvent', selector: '[data-test~=ring-tooltip]', eventname: 'mouseover'},
        {type: 'wait', delay: 500},
        {type: 'capture', name: '', selector: '#root'}
      ]
    }
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

  const overflowStyles = {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  return (
    <Fragment>
      <div style={{paddingBottom: '200px'}}>
        <Tooltip title={loremIpsum} selfOverflowOnly className="lorem-ipsum__text">
          <b>{"Tooltip won't be displayed:"}</b> {loremIpsum}
        </Tooltip>
      </div>
      <div style={{paddingBottom: '200px'}}>
        <Tooltip
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

displayedWhenNecessary.story = {
  name: 'displayed when necessary',

  parameters: {
    hermione: {
      actions: [
        {type: 'mouseEvent', selector: '.lorem-ipsum__text', eventname: 'mouseover'},
        {type: 'capture', name: 'full text element', selector: '#root'},
        {type: 'mouseEvent', selector: '.lorem-ipsum__text_overflow', eventname: 'mouseover'},
        {type: 'capture', name: 'cut text element', selector: '#root'}
      ]
    }
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

nested.story = {
  name: 'nested',

  parameters: {
    hermione: {
      actions: [
        {type: 'mouseEvent', selector: '[data-test~=ring-tooltip]', eventname: 'mouseover'},
        {type: 'wait', delay: 500},
        {type: 'capture', name: '', selector: '#root'}
      ]
    }
  }
};

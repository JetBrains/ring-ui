import {type CSSProperties, Fragment} from 'react';

import Button from '../button/button';
import Link from '../link/link';
import Tooltip from './tooltip';

export default {
  title: 'Components/Tooltip',

  parameters: {
    notes: 'Displays a tooltip.',
    screenshots: {
      actions: [
        {type: 'mouseEvent', selector: '[data-test~=ring-tooltip]', eventname: 'mouseenter'},
        {type: 'wait', delay: 500},
        {type: 'capture', name: '', selector: '#storybook-root'},
      ],
    },
  },
};

export const basic = () => (
  <div style={{paddingBottom: '100px'}}>
    <Tooltip title='Explanation'>
      <Button id='button-with-tooltip'>Button that requires an explanation</Button>
    </Tooltip>
  </div>
);

basic.storyName = 'basic';

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
    whiteSpace: 'nowrap',
  };

  return (
    <Fragment>
      <div style={{paddingBottom: '200px'}}>
        <Tooltip long title={loremIpsum} selfOverflowOnly className='lorem-ipsum__text'>
          <b>{"Tooltip won't be displayed:"}</b> {loremIpsum}
        </Tooltip>
      </div>
      <div style={{paddingBottom: '200px'}}>
        <Tooltip long title={loremIpsum} selfOverflowOnly style={overflowStyles} className='lorem-ipsum__text_overflow'>
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
      {type: 'mouseEvent', selector: '.lorem-ipsum__text', eventname: 'mouseenter'},
      {type: 'capture', name: 'full text element', selector: '#storybook-root'},
      {type: 'mouseEvent', selector: '.lorem-ipsum__text_overflow', eventname: 'mouseenter'},
      {type: 'capture', name: 'cut text element', selector: '#storybook-root'},
    ],
  },
};

export const nested = () => (
  <div style={{paddingBottom: '100px'}}>
    <Tooltip title='Explanation'>
      Some text with an explanation.
      <Tooltip title='Nested Explanation'>
        <strong> Some text inside with a separate explanation. </strong>

        <Tooltip title='Nested Nested Explanation'>
          <Button id='button-with-tooltip'>Inline button that requires an explanation too</Button>
        </Tooltip>

        <strong> Some text inside with a separate explanation. </strong>
      </Tooltip>
      Some text with an explanation.
    </Tooltip>
  </div>
);

nested.storyName = 'nested';

export const complexMarkup = () => (
  <div>
    <Tooltip
      title={(
        <>
          Explanation <Link href='https://google.com'>with</Link>
          <div>
            <b>complex</b>
          </div>{' '}
          markup
        </>
      )}
    >
      <Button id='button-with-tooltip'>Button that requires a complex explanation</Button>
    </Tooltip>
  </div>
);

complexMarkup.parameters = {
  screenshots: {skip: true},
};

export const shortcut = () => (
  <div style={{paddingBottom: '100px'}}>
    <Tooltip
      title={(
        <>
          Action name
          <span className='shortcut'>⌘C</span>
        </>
      )}
    >
      <Button>Button that requires an explanation</Button>
    </Tooltip>
  </div>
);
shortcut.parameters = {
  storyStyles: `
    <style>
      .shortcut {
        color: var(--ring-secondary-color);
        margin-left: var(--ring-unit);
      }
    </style>
  `,
};

export const inheritedTheme = () => (
  <div style={{paddingBottom: '100px'}}>
    <Tooltip title='Explanation' theme='inherit'>
      <Button>Button that requires an explanation</Button>
    </Tooltip>
  </div>
);

import React, {Fragment} from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import Button from '../button/button';
import Tooltip from '../tooltip/tooltip';

storiesOf('Components|Tooltip', module).
  addDecorator(reactDecorator()).
  add('basic', () => (
    <div style={{paddingBottom: '100px'}}>
      <Tooltip title="Explanation">
        <Button>Button that requires an explanation</Button>
      </Tooltip>
    </div>
  ), {
    hermione: {
      skip: true, // TODO: find why hover doesn't work with hermione
      actions: [
        {type: 'mouseMove', selector: 'button'},
        {type: 'capture', name: '', selector: '#root'}
      ]
    }
  }).
  add('displayed when necessary', () => {
    const loremIpsum = 'Lorem ipsum dolor sit amet, vitae alienum prodesset vis ei, quando nullam ' +
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
            <b>Tooltip won't be displayed:</b> {loremIpsum}
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
  }, {
    hermione: {
      skip: true, // TODO: find why hover doesn't work with hermione
      actions: [
        {type: 'mouseMove', selector: '.lorem-ipsum__text'},
        {type: 'capture', name: 'full text element', selector: '#root'},
        {type: 'mouseMove', selector: '.lorem-ipsum__text_overflow'},
        {type: 'capture', name: 'cut text element', selector: '#root'}
      ]
    }
  });

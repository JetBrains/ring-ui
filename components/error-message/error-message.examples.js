import React from 'react';

import reactDecorator from '../../.storybook/react-decorator';
import {FrownIcon} from '../icon';
import Link from '../link/link';

import ErrorMessage from './error-message';

export default {
  title: 'Components|Error Message',
  decorators: [reactDecorator()],

  parameters: {
    notes:
      'Displays an error message centered both vertically and horizontally inside the parent container.'
  }
};

export const basic = () => (
  <div style={{height: '300px'}}>
    <ErrorMessage
      icon={FrownIcon}
      code="Disconnected"
      message="no answer from server."
      description="Please try again soon."
    >
      <Link href="/">Go to the home page</Link>
    </ErrorMessage>
  </div>
);

basic.story = {
  name: 'basic'
};

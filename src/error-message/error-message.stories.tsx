import frownIcon from '@jetbrains/icons/frown';

import Link from '../link/link';
import ErrorMessage from './error-message';

export default {
  title: 'Components/Error Message',

  parameters: {
    notes: 'Displays an error message centered both vertically and horizontally inside the parent container.',
  },
};

export const basic = () => (
  <div style={{height: '300px'}}>
    <ErrorMessage
      icon={frownIcon}
      code='Disconnected'
      message='no answer from server.'
      description='Please try again soon.'
    >
      <Link href='/'>Go to the home page</Link>
    </ErrorMessage>
  </div>
);

basic.storyName = 'Error Message';

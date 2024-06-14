import {Fragment} from 'react';

import Link from '../link/link';

import clipboard from './clipboard';

export default {
  title: 'Components/Clipboard',

  parameters: {
    notes: 'Displays a link which copies test to clipboard.',
    screenshots: {skip: true}
  }
};

const DEMO_TEXT = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt' +
  'ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.' +
  'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur' +
  'sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.' +
  'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata' +
  'sanctus est Lorem ipsum dolor sit amet.';

export const copyToClipboard = () => (
  <Fragment>
    <div>{DEMO_TEXT}</div>
    <div>
      <Link
        onClick={() => clipboard.copyText(DEMO_TEXT, 'Text copied!', 'Text copying error')}
        pseudo
      >
        Copy
      </Link>
    </div>
  </Fragment>
);

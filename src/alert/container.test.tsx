import {render, screen} from '@testing-library/react';

import Alert from './alert';
import AlertContainer from './container';

describe('Alert Container', () => {
  it('should render alert container to body', () => {
    render(
      <AlertContainer>
        <Alert>{'Test'}</Alert>
      </AlertContainer>,
    );
    expect(screen.getByTestId('alert-container')).to.exist;
  });
});

import React from 'react';
import {mount} from 'enzyme';

import Alert from './alert';
import AlertContainer from './container';

describe('Alert Container', () => {
  const children = <Alert>{'Test'}</Alert>;

  const mountAlertContainer = props => mount(
    <AlertContainer {...props}>{children}</AlertContainer>
  );

  it('should render alert container component', () => {
    mountAlertContainer().should.have.type(AlertContainer);
  });

  it('should render alert container to body', () => {
    mountAlertContainer();
    document.body.should.contain('*[data-test="alert-container"]');
  });
});

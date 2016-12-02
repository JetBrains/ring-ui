/* eslint-disable func-names */

import Alert from '../alert/alert';
import AlertContainer from './alert-container';
import React from 'react';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

describe('Alert Container', () => {
  const children = <Alert>{'Test'}</Alert>;

  const renderComponent = props => renderIntoDocument(<AlertContainer {...props}/>);

  it('should render alert container component', () => {
    isCompositeComponentWithType(renderComponent({children}), AlertContainer).should.be.true;
  });

  it('should render alert container to body', () => {
    renderComponent({children});
    document.body.should.contain('*[data-test="alert-container"]');
  });
});

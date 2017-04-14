import 'dom4';
import React from 'react';
import {isCompositeComponentWithType, renderIntoDocument} from 'react-dom/test-utils';

import AuthDialog from './auth-dialog';
import styles from '../auth-dialog/auth-dialog.css';

describe('AuthDialog', () => {
  const defaultProps = {show: true, text: 'Foo'};
  const renderComponent = props => renderIntoDocument(<AuthDialog {...props}/>);

  const getContainer = () => document.querySelector('*[data-test="ring-auth-dialog"]');

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(defaultProps), AuthDialog).should.be.true;
  });

  it('should render confirm', () => {
    renderComponent(defaultProps);
    getContainer().should.contain(`.${styles.title}`);
  });
});

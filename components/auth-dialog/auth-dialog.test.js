import 'dom4';
import React from 'react';
import {mount} from 'enzyme';

import styles from '../auth-dialog/auth-dialog.css';

import AuthDialog from './auth-dialog';

describe('AuthDialog', () => {
  const defaultProps = {show: true, text: 'Foo'};
  const mountAuthDialog = props => mount(<AuthDialog {...props}/>);

  const getContainer = () => document.querySelector('*[data-test="ring-auth-dialog"]');

  it('should create component', () => {
    mountAuthDialog(defaultProps).should.have.type(AuthDialog);
  });

  it('should render confirm', () => {
    mountAuthDialog(defaultProps);
    getContainer().should.contain(`.${styles.title}`);
  });
});

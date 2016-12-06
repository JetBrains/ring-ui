import 'dom4';
import React from 'react';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

import Confirm from './confirm';
import styles from './confirm.css';

describe('Confirm', () => {
  const renderComponent = props => renderIntoDocument(<Confirm {...props}/>);

  const getContainer = () => document.querySelector('*[data-test="ring-dialog"]');

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent({show: true}), Confirm).should.be.true;
  });

  it('should render confirm to body', () => {
    renderComponent({show: true, text: 'Foo'});
    getContainer().should.contain(`.${styles.text}`);
  });
});

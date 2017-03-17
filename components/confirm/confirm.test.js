import 'dom4';
import React from 'react';
import {isCompositeComponentWithType} from 'react-addons-test-utils';
import renderIntoDocument from 'render-into-document';

import Confirm from './confirm';
import islandStyles from '../island/island.css';

describe('Confirm', () => {
  const defaultProps = {show: true, text: 'Foo'};
  const renderComponent = props => renderIntoDocument(<Confirm {...props}/>);

  const getContainer = () => document.querySelector('*[data-test="ring-dialog"]');

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(defaultProps), Confirm).should.be.true;
  });

  it('should render confirm', () => {
    renderComponent(defaultProps);
    getContainer().should.contain(`.${islandStyles.title}`);
  });
});

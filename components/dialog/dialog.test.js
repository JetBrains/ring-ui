import 'dom4';
import React from 'react';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

import Dialog from './dialog';
import styles from './dialog.css';

describe('Dialog', () => {
  const children = <div/>;
  const renderComponent = props => renderIntoDocument(<Dialog {...props}/>);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent({show: true, children}), Dialog).should.be.true;
  });

  it('should wrap children with dialog wrapper', () => {
    renderComponent({show: true, children}).refs.dialog.should.match(`.${styles.container}`);
  });

  it('should use passed className', () => {
    renderComponent({show: true, children, className: 'test-class'}).refs.dialog.should.match('.test-class');
  });
});

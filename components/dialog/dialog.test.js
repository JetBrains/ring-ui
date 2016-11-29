import 'dom4';
import React from 'react';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

import Dialog, {DialogHeader, DialogBody, DialogFooter} from './dialog';

describe('Dialog', () => {
  const children = <div/>;
  const renderComponent = props => renderIntoDocument(<Dialog {...props}/>);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent({show: true, children}), Dialog).should.be.true;
  });

  it('should wrap children with dialog wrapper', () => {
    renderComponent({show: true, children}).refs.dialog.should.match('.ring-dialog__wrapper');
  });

  it('should use passed className', () => {
    renderComponent({show: true, children, className: 'test-class'}).refs.dialog.should.match('.test-class');
  });

  it('should render header', () => {
    renderComponent({
      show: true,
      children: <div>
        <DialogHeader>{'Header'}</DialogHeader>
      </div>
    }).refs.dialog.should.contain('.ring-dialog__header');
  });

  it('should render body', () => {
    renderComponent({
      show: true,
      children: <div>
        <DialogBody>{'Body'}</DialogBody>
      </div>
    }).refs.dialog.should.contain('.ring-dialog__content');
  });

  it('should render footer', () => {
    renderComponent({
      show: true,
      children: <div>
        <DialogFooter>{'Footer'}</DialogFooter>
      </div>
    }).refs.dialog.should.contain('.ring-dialog__footer');
  });
});

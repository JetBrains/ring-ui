import React, {HTMLAttributes} from 'react';
import {shallow, mount} from 'enzyme';

import ButtonToolbar from './button-toolbar';

describe('Button Toolbar', () => {
  const shallowButtonToolbar = (params?: HTMLAttributes<HTMLElement>) =>
    shallow(<ButtonToolbar {...params}/>);
  const mountButtonToolbar = (params?: HTMLAttributes<HTMLElement>) =>
    mount(<ButtonToolbar {...params}/>);

  it('should create component', () => {
    mountButtonToolbar().should.have.type(ButtonToolbar);
  });

  it('should wrap children with div', () => {
    shallowButtonToolbar().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowButtonToolbar({className: 'test-class'}).should.have.className('test-class');
  });
});

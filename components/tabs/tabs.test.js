import {shallow} from 'enzyme';
import React from 'react';

import {Tabs, Tab} from './tabs';

describe('Tabs', () => {
  const shallowTabs = props => shallow(
    <Tabs {...props}>
      <Tab title="1"/>
      <Tab title="2"/>
    </Tabs>
  );

  it('should create component', () => {
    shallowTabs().should.be.present();
  });

  it('should wrap children with div', () => {
    shallowTabs().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowTabs({className: 'test-class'}).should.have.className('test-class');
  });

  // TODO Add more tests
});

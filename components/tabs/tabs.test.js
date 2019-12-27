import {mount} from 'enzyme';
import React from 'react';

import {Tabs, Tab} from './tabs';

describe('Tabs', () => {
  const mountTabs = props => mount(
    <Tabs {...props}>
      <Tab title="1"/>
      <Tab title="2"/>
    </Tabs>
  );
  const getTabsDiv = props => mountTabs(props).find('div').at(0);

  it('should create component', () => {
    mountTabs().should.exist;
  });

  it('should wrap children with div', () => {
    getTabsDiv().should.exist;
  });

  it('should use passed className', () => {
    getTabsDiv({className: 'test-class'}).should.have.className('test-class');
  });
});

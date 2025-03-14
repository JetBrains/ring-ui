import {render, screen} from '@testing-library/react';

import {Tabs, Tab} from './tabs';
import {TabsAttrs} from './dumb-tabs';

describe('Tabs', () => {
  const renderTabs = (props?: Partial<TabsAttrs>) =>
    render(
      <Tabs {...props}>
        <Tab title="1" />
        <Tab title="2" />
      </Tabs>,
    );

  it('should create component', () => {
    renderTabs();
    screen.getByTestId('ring-dumb-tabs').should.exist;
  });

  it('should wrap children with div', () => {
    renderTabs();
    screen.getByTestId('ring-dumb-tabs').should.exist;
  });

  it('should use passed className', () => {
    renderTabs({className: 'test-class'});
    screen.getByTestId('ring-dumb-tabs').should.have.class('test-class');
  });
});

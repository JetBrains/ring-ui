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
    expect(screen.getByTestId('ring-dumb-tabs')).to.exist;
  });

  it('should wrap children with div', () => {
    renderTabs();
    expect(screen.getByTestId('ring-dumb-tabs')).to.exist;
  });

  it('should use passed className', () => {
    renderTabs({className: 'test-class'});
    expect(screen.getByTestId('ring-dumb-tabs')).to.have.class('test-class');
  });
});

import {render, screen} from '@testing-library/react';

import {Tabs, Tab, CustomItem} from './tabs';
import {type TabsAttrs} from './dumb-tabs';

describe('Tabs', () => {
  const renderTabs = (props?: Partial<TabsAttrs>) =>
    render(
      <Tabs {...props}>
        <Tab title='1' />
        <Tab title='2' />
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

  it('should select the tab referenced by id', () => {
    render(
      <Tabs selected='second'>
        <Tab id='first' title='First'>
          <span data-test='tab-first-content' />
        </Tab>
        <Tab id='second' title='Second'>
          <span data-test='tab-second-content' />
        </Tab>
      </Tabs>,
    );
    expect(screen.queryByTestId('tab-first-content')).to.not.exist;
    expect(screen.queryByTestId('tab-second-content')).to.exist;
    expect(screen.getByRole('button', {name: 'First'})).to.not.have.attribute('data-test-selected', 'true');
    expect(screen.getByRole('button', {name: 'Second'})).to.have.attribute('data-test-selected', 'true');
  });

  it('should render the selected tab content, referenced by index', () => {
    render(
      <Tabs selected='1'>
        <Tab title='Tab 0'>
          <span data-test='tab-0-content' />
        </Tab>
        <Tab title='Tab 1'>
          <span data-test='tab-1-content' />
        </Tab>
      </Tabs>,
    );
    expect(screen.queryByTestId('tab-0-content')).to.not.exist;
    expect(screen.queryByTestId('tab-1-content')).to.exist;
    expect(screen.getByRole('button', {name: 'Tab 0'})).to.not.have.attribute('data-test-selected', 'true');
    expect(screen.getByRole('button', {name: 'Tab 1'})).to.have.attribute('data-test-selected', 'true');
  });

  it('should render the first tab if selected id is not found', () => {
    render(
      <Tabs selected='non-existing-id'>
        <Tab id='first' title='First'>
          <span data-test='tab-first-content' />
        </Tab>
        <Tab id='second' title='Second'>
          <span data-test='tab-second-content' />
        </Tab>
      </Tabs>,
    );
    expect(screen.queryByTestId('tab-first-content')).to.exist;
    expect(screen.queryByTestId('tab-second-content')).to.not.exist;
    expect(screen.getByRole('button', {name: 'First'})).to.have.attribute('data-test-selected', 'true');
    expect(screen.getByRole('button', {name: 'Second'})).to.not.have.attribute('data-test-selected', 'true');
  });

  it('should skip CustomItem when selecting the fallback tab', () => {
    render(
      <Tabs selected='non-existing-id'>
        <CustomItem>
          <span data-test='custom-item-content' />
        </CustomItem>
        <Tab id='first' title='First'>
          <span data-test='tab-first-content' />
        </Tab>
        <Tab id='second' title='Second'>
          <span data-test='tab-second-content' />
        </Tab>
      </Tabs>,
    );
    expect(screen.queryByTestId('tab-first-content')).to.exist;
    expect(screen.queryByTestId('tab-second-content')).to.not.exist;
    expect(screen.queryAllByTestId('custom-item-content')).to.have.length(1);
    expect(screen.getByRole('button', {name: 'First'})).to.have.attribute('data-test-selected', 'true');
    expect(screen.getByRole('button', {name: 'Second'})).to.not.have.attribute('data-test-selected', 'true');
  });
});

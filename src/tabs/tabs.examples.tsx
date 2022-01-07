import React, {Component} from 'react';
import searchIcon from '@jetbrains/icons/search';
import warningIcon from '@jetbrains/icons/warning';

import reactDecorator from '../../.storybook/react-decorator';

import Button from '../button/button';
import Icon, {IconProps} from '../icon/icon';

import Theme, {ThemeProvider} from '../global/theme';

import {CustomItem, SmartTabs, Tab, Tabs} from './tabs';

export default {
  title: 'Components/Tabs',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a tab set.'
  }
};

class BasicDemo extends Component {
  state = {selected: 'first'};

  render() {
    return (
      <Tabs selected={this.state.selected} onSelect={selected => this.setState({selected})}>
        <Tab id="first" title="First tab">
          First tab content
        </Tab>
        <Tab id="second" title="Second tab">
          Second tab content
        </Tab>
        <Tab id="third" title="Third tab">
          Third tab content
        </Tab>
        <Tab id="fourth" title="Fourth tab (Link)" href="/">
          Fourth tab content
        </Tab>
        <Tab disabled id="disabled" title="Disabled tab">
          Disabled tab content
        </Tab>
      </Tabs>
    );
  }
}
export const basic = () => <BasicDemo/>;

basic.storyName = 'basic';


const autocollapseData = [
  {
    id: 'first',
    title: 'First tab',
    content: 'First tab content'
  },
  {
    id: 'second',
    title: 'Second tab',
    content: 'Second tab content'
  },
  {
    id: 'third',
    title: 'Third tab',
    content: 'Third tab content'
  },
  {
    id: 'fourth',
    title: 'Fourth tab (Link)',
    href: '/',
    content: 'Fourth tab content'
  },
  {
    id: 'disabled1',
    title: 'Disabled tab',
    content: 'Disabled tab content',
    disabled: true
  },
  {
    id: 'fifth',
    title: 'Fifth tab (Always hidden)',
    alwaysHidden: true,
    href: '/',
    content: 'Hidden tab content'
  },
  {
    id: 'custom',
    alwaysHidden: true,
    custom: true,
    content: <Button text style={{padding: 0}}>Custom Item</Button>
  }
];

const AutoCollapseDemo = () => {
  const [selected, setSelected] = React.useState('first');
  const [tabs, setTabs] = React.useState(autocollapseData.map(item => {
    const {content, ...tabProps} = item;
    const Host = item.custom === true ? CustomItem : Tab;

    return <Host key={item.id} {...tabProps}>{content}</Host>;
  }));

  const addTab = React.useCallback(() => {
    setTabs(state => {
      const newTab = (
        <Tab
          id={String(state.length)}
          key={state.length}
          title={`Example ${state.length + 1}`}
        >{`Example ${state.length + 1} tab content`}</Tab>
      );

      return [
        ...state,
        newTab
      ];
    });
  }, []);

  const selectHandler = React.useCallback(key => {
    setSelected(key);
  }, []);

  return (
    <>
      <Button onClick={addTab} title={'Add tab'} style={{margin: '10px 0'}}>{'Add tab'}</Button>
      <Tabs
        selected={selected}
        onSelect={selectHandler}
        autoCollapse
        initialVisibleItems={3}
      >
        {tabs}
      </Tabs>
    </>
  );
};
export const autoCollapseDemo = () => <AutoCollapseDemo/>;

autoCollapseDemo.storyName = 'Auto collapsing';


class DarkDemo extends Component {
  state = {selected: 'first'};

  render() {
    return (
      <ThemeProvider theme={Theme.DARK}>
        <Tabs
          selected={this.state.selected}
          onSelect={selected => this.setState({selected})}
          className="dark-wrapper"
        >
          <Tab id="first" title="First tab">
            First tab content
          </Tab>
          <Tab id="second" title="Second tab">
            Second tab content
          </Tab>
          <Tab id="third" title="Third tab">
            Third tab content
          </Tab>
          <Tab id="fourth" title="Fourth tab (Link)" href="/">
            Fourth tab content
          </Tab>
          <Tab disabled id="disabled" title="Disabled tab">
            Disabled tab content
          </Tab>
        </Tabs>
      </ThemeProvider>
    );
  }
}
export const dark = () => <DarkDemo/>;

dark.storyName = 'dark';

dark.parameters = {
  storyStyles: `
<style>
  .dark-wrapper {
    background: var(--ring-content-background-color);
    padding: 8px;
    color: var(--ring-text-color);
  }
</style>`
};

export const smart = () => (
  <SmartTabs>
    <Tab title="First tab">First tab content</Tab>
    <Tab title="Second tab">Second tab content</Tab>
    <Tab title="Third tab">Third tab content</Tab>
    <Tab title="Fourth  tab (Link)" href="/">
      Fourth tab content
    </Tab>
    <Tab disabled title="Disabled tab">
      Disabled tab content
    </Tab>
  </SmartTabs>
);
smart.storyName = 'smart';

function Title({glyph, title, children, className}: Partial<IconProps>) {
  return (
    <span className={className}>
      <Icon glyph={glyph} title={title} className="icon"/>
      {children}
    </span>
  );
}
export const customTitles = () => (
  <SmartTabs>
    <Tab title={<Title glyph={searchIcon}>First tab</Title>}>First tab content</Tab>
    <Tab title={<Title glyph={warningIcon}>Second tab</Title>}>Second tab content</Tab>
    <Tab title={<Title glyph={warningIcon}>Third tab (Link)</Title>} href="/">
      Third tab content
    </Tab>
    <CustomItem>
      <Button text>Action</Button>
    </CustomItem>
  </SmartTabs>
);
customTitles.storyName = 'custom titles';

customTitles.parameters = {
  storyStyles: `
<style>
  .icon.icon {
    vertical-align: 1px;
    line-height: normal;
    margin-right: 4px;
  }
</style>
      `
};

export const customTitlesFunction = () => (
  <SmartTabs>
    <Tab
      title={isSelected => (
        <Title title={isSelected ? undefined : 'First tab'} glyph={searchIcon} className={isSelected ? 'has-content' : ''}>
          {isSelected && 'First tab'}
        </Title>
      )}
    >
      First tab content
    </Tab>
    <Tab
      title={isSelected => (
        <Title title={isSelected ? undefined : 'Second tab (Link)'} glyph={warningIcon} className={isSelected ? 'has-content' : ''}>
          {isSelected && 'Second tab (Link)'}
        </Title>
      )}
      href="/"
    >
      Second tab content
    </Tab>
  </SmartTabs>
);
customTitlesFunction.storyName = 'custom titles (function)';

customTitlesFunction.parameters = {
  storyStyles: `
<style>
  .icon.icon {
    vertical-align: 3px;
    line-height: normal;
  }

  .has-content .icon.icon {
    margin-right: 4px;
  }
</style>
      `
};

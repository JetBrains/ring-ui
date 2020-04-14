import React, {Component} from 'react';
import searchIcon from '@jetbrains/icons/search.svg';
import warningIcon from '@jetbrains/icons/warning.svg';

import reactDecorator from '../../.storybook/react-decorator';

import Button from '@jetbrains/ring-ui/components/button/button';
import Icon from '@jetbrains/ring-ui/components/icon/icon';

import {Tabs, Tab, SmartTabs, CustomItem} from '@jetbrains/ring-ui/components/tabs/tabs';

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

basic.story = {
  name: 'basic'
};

class DarkDemo extends Component {
  state = {selected: 'first'};

  render() {
    return (
      <Tabs
        selected={this.state.selected}
        onSelect={selected => this.setState({selected})}
        theme={Tabs.Theme.DARK}
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
    );
  }
}
export const dark = () => <DarkDemo/>;

dark.story = {
  name: 'dark',

  parameters: {
    storyStyles: `
  <style>
    .dark-wrapper {
      background: #000;
      padding: 8px;
      color: #fff;
    }
  </style>`
  }
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
smart.story = {
  name: 'smart'
};

function Title({glyph, title, children, className}) {
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
customTitles.story = {
  name: 'custom titles',

  parameters: {
    storyStyles: `
  <style>
    .icon.icon {
      vertical-align: 1px;
      line-height: normal;
      margin-right: 4px;
    }
  </style>
        `
  }
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
customTitlesFunction.story = {
  name: 'custom titles (function)',

  parameters: {
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
  }
};

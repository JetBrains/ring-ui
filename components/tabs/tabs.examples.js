import React, {Component} from 'react';

import reactDecorator from '../../.storybook/react-decorator';

import {SearchIcon, WarningIcon} from '../icon';
import Button from '../button/button';

import {Tabs, Tab, SmartTabs, CustomItem} from './tabs';

export default {
  title: 'Components|Tabs',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a tab set.'
  }
};

export const basic = () => {
  class TabsDemo extends Component {
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
          <Tab id="fourth" title="Fourth tab (Link)" href="#href">
            Fourth tab content
          </Tab>
          <Tab disabled id="disabled" title="Disabled tab">
            Disabled tab content
          </Tab>
        </Tabs>
      );
    }
  }

  return <TabsDemo/>;
};

basic.story = {
  name: 'basic'
};

export const dark = () => {
  class TabsDemo extends Component {
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
          <Tab id="fourth" title="Fourth tab (Link)" href="#href">
            Fourth tab content
          </Tab>
          <Tab disabled id="disabled" title="Disabled tab">
            Disabled tab content
          </Tab>
        </Tabs>
      );
    }
  }

  return <TabsDemo/>;
};

dark.story = {
  name: 'dark',

  parameters: {
    storyStyles: `
  <style>
    .dark-wrapper {
      background: #000;
      padding: 8px;
    }
  </style>`
  }
};

export const smart = () => {
  class TabsDemo extends Component {
    render() {
      return (
        <SmartTabs>
          <Tab title="First tab">First tab content</Tab>
          <Tab title="Second tab">Second tab content</Tab>
          <Tab title="Third tab">Third tab content</Tab>
          <Tab title="Fourth  tab (Link)" href="#href">
            Fourth tab content
          </Tab>
          <Tab disabled title="Disabled tab">
            Disabled tab content
          </Tab>
        </SmartTabs>
      );
    }
  }

  return <TabsDemo/>;
};

smart.story = {
  name: 'smart'
};

export const customTitles = () => {
  class TabsDemo extends Component {
    render() {
      function Title({Icon, children}) {
        return (
          <span>
            <Icon className="icon"/>
            {children}
          </span>
        );
      }

      return (
        <SmartTabs>
          <Tab title={<Title Icon={SearchIcon}>First tab</Title>}>First tab content</Tab>
          <Tab title={<Title Icon={WarningIcon}>Second tab</Title>}>Second tab content</Tab>
          <Tab title={<Title Icon={WarningIcon}>Third tab (Link)</Title>} href="#href">
            Third tab content
          </Tab>
          <CustomItem>
            <Button text>Action</Button>
          </CustomItem>
        </SmartTabs>
      );
    }
  }

  return <TabsDemo/>;
};

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

export const customTitlesFunction = () => {
  class TabsDemo extends Component {
    render() {
      function Title({Icon, children}) {
        return (
          <span className={children ? 'has-content' : ''}>
            <Icon className="icon"/>
            {children}
          </span>
        );
      }

      return (
        <SmartTabs>
          <Tab title={isSelected => <Title Icon={SearchIcon}>{isSelected && 'First tab'}</Title>}>
            First tab content
          </Tab>
          <Tab
            title={isSelected => (
              <Title Icon={WarningIcon}>{isSelected && 'Second tab (Link)'}</Title>
            )}
            href="#href"
          >
            Second tab content
          </Tab>
        </SmartTabs>
      );
    }
  }

  return <TabsDemo/>;
};

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

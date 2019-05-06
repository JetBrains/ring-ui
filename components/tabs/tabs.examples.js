/* eslint-disable max-len */
import React, {Component} from 'react';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';

import {SearchIcon, WarningIcon} from '../icon';
import Button from '../button/button';

import {Tabs, Tab, SmartTabs, CustomItem} from './tabs';

storiesOf('Components|Tabs', module).
  addDecorator(reactDecorator()).
  addParameters({
    notes: 'Displays a tab set.'
  }).
  add('basic', () => {
    class TabsDemo extends Component {
      state = {selected: 'first'};

      render() {
        return (
          <Tabs
            selected={this.state.selected}
            onSelect={selected => this.setState({selected})}
          >
            <Tab
              id="first"
              title="First tab"
            >
              First tab content
            </Tab>
            <Tab
              id="second"
              title="Second tab"
            >
              Second tab content
            </Tab>
            <Tab
              id="third"
              title="Third tab"
            >
              Third tab content
            </Tab>
            <Tab
              id="fourth"
              title="Fourth tab (Link)"
              href="#href"
            >
              Fourth tab content
            </Tab>
            <Tab
              disabled
              id="disabled"
              title="Disabled tab"
            >
              Disabled tab content
            </Tab>
          </Tabs>
        );
      }
    }

    return <TabsDemo/>;
  }).
  add('dark', () => {
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
            <Tab
              id="first"
              title="First tab"
            >
              First tab content
            </Tab>
            <Tab
              id="second"
              title="Second tab"
            >
              Second tab content
            </Tab>
            <Tab
              id="third"
              title="Third tab"
            >
              Third tab content
            </Tab>
            <Tab
              id="fourth"
              title="Fourth tab (Link)"
              href="#href"
            >
              Fourth tab content
            </Tab>
            <Tab
              disabled
              id="disabled"
              title="Disabled tab"
            >
              Disabled tab content
            </Tab>
          </Tabs>
        );
      }
    }

    return <TabsDemo/>;
  }, {
    storyStyles: `
<style>
  .dark-wrapper {
    background: #000;
    padding: 8px;
  }
</style>`
  }).
  add('smart', () => {
    class TabsDemo extends Component {
      render() {
        return (
          <SmartTabs>
            <Tab title="First tab">
              First tab content
            </Tab>
            <Tab title="Second tab">
              Second tab content
            </Tab>
            <Tab title="Third tab">
              Third tab content
            </Tab>
            <Tab title="Fourth  tab (Link)" href="#href">
              Fourth tab content
            </Tab>
            <Tab
              disabled
              title="Disabled tab"
            >
              Disabled tab content
            </Tab>
          </SmartTabs>
        );
      }
    }

    return <TabsDemo/>;
  }).
  add('custom titles', () => {
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
            <Tab title={<Title Icon={SearchIcon}>First tab</Title>}>
              First tab content
            </Tab>
            <Tab title={<Title Icon={WarningIcon}>Second tab</Title>}>
              Second tab content
            </Tab>
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
  }, {
    storyStyles: `
<style>
  .icon.icon {
    vertical-align: 1px;
    line-height: normal;
    margin-right: 4px;
  }
</style>
      `
  }).
  add('custom titles (function)', () => {
    class TabsDemo extends Component {
      render() {
        function Title({Icon, children}) {
          return (
            <span className={children ? 'has-content' : ''}>
              <Icon
                className="icon"
              />
              {children}
            </span>
          );
        }

        return (
          <SmartTabs>
            <Tab title={isSelected => <Title Icon={SearchIcon}>{isSelected && 'First tab'}</Title>}>
              First tab content
            </Tab>
            <Tab title={isSelected => <Title Icon={WarningIcon}>{isSelected && 'Second tab (Link)'}</Title>} href="#href">
              Second tab content
            </Tab>
          </SmartTabs>
        );
      }
    }

    return <TabsDemo/>;
  }, {
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
  });

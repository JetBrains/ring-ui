import {useState, useCallback} from 'react';
import searchIcon from '@jetbrains/icons/search';
import warningIcon from '@jetbrains/icons/warning';

import classNames from 'classnames';

import Button from '../button/button';
import Icon from '../icon/icon';

import {CustomItem, SmartTabs, Tab, Tabs} from './tabs';

export default {
  title: 'Components/Tabs',

  parameters: {
    notes: 'Displays a tab set.',
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc710be093ab38d4212f',
    storyStyles: `
      <style>
        .info {
          color: var(--ring-secondary-color);
          margin-left: calc(var(--ring-unit) / 2);
        }

        .icon {
          margin-right: calc(var(--ring-unit) / 2);
          color: var(--ring-icon-secondary-color)
        }

        .tab:hover .icon {
          color: var(--ring-link-hover-color);
        }

        .selected .icon.icon {
          color: var(--ring-text-color);
        }
      </style>
    `,
  },
};

export const Basic = () => {
  const [selected, setSelected] = useState('first');

  return (
    <Tabs selected={selected} onSelect={setSelected}>
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
};

export const Links = () => {
  const {search} = window.location;
  const selected = new URLSearchParams(search).get('selected') ?? 'first';

  return (
    <Tabs selected={selected}>
      <Tab id="first" title="First tab" href={`${search}&selected=first`}>
        First tab content
      </Tab>
      <Tab id="second" title="Second tab" href={`${search}&selected=second`}>
        Second tab content
      </Tab>
      <Tab id="third" title="Third tab" href={`${search}&selected=third`}>
        Third tab content
      </Tab>
    </Tabs>
  );
};

Links.storyName = 'links';

export const AutoCollapseDemo = () => {
  const [selected, setSelected] = useState('first');
  const autocollapseData = [
    {
      id: 'first',
      title: 'First tab',
      content: 'First tab content',
    },
    {
      id: 'second',
      title: 'Second tab',
      content: 'Second tab content',
    },
    {
      id: 'third',
      title: 'Third tab',
      content: 'Third tab content',
    },
    {
      id: 'fourth',
      title: 'Fourth tab (Link)',
      href: '/',
      content: 'Fourth tab content',
    },
    {
      id: 'disabled1',
      title: 'Disabled tab',
      content: 'Disabled tab content',
      disabled: true,
    },
    {
      id: 'fifth',
      title: 'Fifth tab (Always hidden)',
      alwaysHidden: true,
      href: '/',
      content: 'Hidden tab content',
    },
    {
      id: 'custom',
      alwaysHidden: true,
      custom: true,
      content: (
        <Button inline style={{padding: 0}}>
          Custom Item
        </Button>
      ),
    },
  ];
  const [tabs, setTabs] = useState(
    autocollapseData.map(item => {
      const {content, ...tabProps} = item;
      const Host = item.custom === true ? CustomItem : Tab;

      return (
        <Host key={item.id} {...tabProps}>
          {content}
        </Host>
      );
    }),
  );

  const addTab = useCallback(() => {
    setTabs(state => {
      const newTab = (
        <Tab
          id={String(state.length)}
          key={state.length}
          title={`Example ${state.length + 1}`}
        >{`Example ${state.length + 1} tab content`}</Tab>
      );

      return [...state, newTab];
    });
  }, []);

  const selectHandler = useCallback((key: string) => {
    setSelected(key);
  }, []);

  return (
    <>
      <Button onClick={addTab} title={'Add tab'} style={{margin: '10px 0'}}>
        {'Add tab'}
      </Button>
      <Tabs selected={selected} onSelect={selectHandler} autoCollapse initialVisibleItems={3}>
        {tabs}
      </Tabs>
    </>
  );
};

AutoCollapseDemo.storyName = 'Auto collapsing';

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

export const customTitles = () => (
  <SmartTabs>
    <Tab
      className="tab"
      title={
        <>
          First tab<span className="info">10</span>
        </>
      }
    >
      First tab content
    </Tab>
    <Tab
      className="tab"
      title={
        <>
          Second tab<span className="info">Help text</span>
        </>
      }
    >
      Second tab content
    </Tab>
    <Tab
      className="tab"
      title={
        <>
          Third tab (Link)<span className="info">10</span>
        </>
      }
      href="/"
    >
      Third tab content
    </Tab>
    <CustomItem>
      <Button inline>Action</Button>
    </CustomItem>
  </SmartTabs>
);
customTitles.storyName = 'custom titles';

export const customTitlesFunction = () => (
  <SmartTabs>
    <Tab
      className="tab"
      title={isSelected => (
        <span className={classNames({selected: isSelected})}>
          <Icon glyph={searchIcon} className="icon" />
          {'First tab'}
        </span>
      )}
    >
      First tab content
    </Tab>
    <Tab
      className="tab"
      title={isSelected => (
        <span className={classNames({selected: isSelected})}>
          <Icon glyph={warningIcon} className="icon" />
          {'Second tab (Link)'}
        </span>
      )}
      href="/"
    >
      Second tab content
    </Tab>
  </SmartTabs>
);
customTitlesFunction.storyName = 'custom titles (function)';

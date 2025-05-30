import {createElement, useState, useEffect} from 'react';
import warningIcon from '@jetbrains/icons/warning';
import {StoryFn} from '@storybook/react-webpack5';
import {fn} from 'storybook/test';

import hubConfig from '../../.storybook/hub-config';

import Loader from '../loader/loader';
import Tooltip from '../tooltip/tooltip';
import Auth from '../auth/auth';
import Code from '../code/code';
import ContentLayout, {Sidebar} from '../content-layout/content-layout';

import Link from '../link/link';

import List, {ListAttrs} from './list';
import Source from './list__users-groups-source';
import styles from './list.stories.css';
import {ListDataItem} from './consts';

const FLAG_EN_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKCAMAAACKYC6uAAAAB3RJTUUH3AIcDR8UFn+EAwAAAAlwSFlzAAAewQAAHsEBw2lUUwAAAARnQU1BAACxjwv8YQUAAAHgUExURf///9LAwLxiY51KVk1Pew0uch0pcImTtOBwdeVzeKasyEZQjDZHfWh3mK2xtq2Dg5NKT3OEqbi9xsWMjLBGS35YcCY8enWCptZkaOFtcaKpx1xsoa24ys++vrlyc5ZcZVJVdFRsoVFnlpqtv8i4ubpiZJ1jcamsvcRTWtFbYtPZ5+Tv9+/Q0Mp9gZqAkU1kjCtDc+vT2NW7wsClrMSnqsGgo8KSlMylpbM5Qr5FTfDOzvnb3O7JzOPCxcazuLafpbCYnddxeNZqcsBOVagsNZ0XIZsRG5wRHKUbJbErNcA8Rs5PWNRdZdFdZcNSWrFDSqg8Q6dFTN12fdFja7lGTqYnMZwTHZoOGJ4THagfKbUvOcRFTtBUXdRcZc5bY8BPV69BSJeCh8CrsOzY3ubFx86ipcmpqsWhoZ8iK6MjLNKnqdyoqurKzfXb3ObM09rAx82zuA4jTkRafrWhseadoefDwsHL05+ot6cuNqcoMKKjtKhwftmDhvTj49Hi8XWLuE5mnCkuSnJASa1sbsjS4lFglW13mbE6P64rMGNtkCA3do9thtNxdvK6u+ns846fxGwrL3pSUpCSlnF/nGp7rldgmoiQrrhHS68vM2hvkAUTXBAwdGRrlcR6huyWmPzp6TUvvy8AAAABdFJOUwBA5thmAAAAtUlEQVR42gGqAFX/AJCRkpOUlZaXmJmam5ydnp8AgYKDfYSFhoeIiYqLjI2OjwBxcnN0dXZ3eHl6e3x9fn+AAGFiY2RlZmdoaWprbG1ub3AAUVJTVFVWV1hZWltcXV5fYABBQkNERUZHSElKS0xNTk9QADEyMzQ1Njc4OTo7PD0+P0AAISIjJCUmJygpKissLS4vMAAREhMUFRYXGBkaGxwdHh8gAAECAwQFBgcICQoLDA0ODxAO4zIu3IgQpAAAAABJRU5ErkJggg==';

export default {
  title: 'Components/List',

  component: List,
  parameters: {
    screenshots: {captureSelector: '*[data-test~=ring-list]'},
  },
  args: {
    onResize: fn(),
  },
};

export const basic: StoryFn<ListAttrs> = args => <List {...args} />;

basic.storyName = 'basic';
basic.args = {
  activeIndex: 2,
  shortcuts: true,
  renderOptimization: false,
  data: [
    {label: 'One', key: 1, href: 'http://example.com', rgItemType: List.ListProps.Type.LINK},
    {label: <b>foo</b>, key: 2, rgItemType: List.ListProps.Type.ITEM},
    {label: 'Active as default', key: 3, rgItemType: List.ListProps.Type.ITEM},
    {label: 'Four', key: 4, rgItemType: List.ListProps.Type.ITEM},
    {label: 'Five', key: 5, rgItemType: List.ListProps.Type.ITEM},
  ],
};

export const withAHintBelow: StoryFn<ListAttrs> = args => <List {...args} />;

withAHintBelow.storyName = 'with a hint below';
withAHintBelow.args = {
  shortcuts: true,
  activeIndex: 2,
  hint: (
    <>
      <Link href="http://example.com" target="_blank" rel="noreferrer">
        Hint
      </Link>
      {' about the list'}
    </>
  ),
  renderOptimization: false,
  data: [
    {label: 'One', rgItemType: List.ListProps.Type.ITEM},
    {label: 'Two', rgItemType: List.ListProps.Type.ITEM},
    {label: 'Active as default', rgItemType: List.ListProps.Type.ITEM},
    {label: 'Four', rgItemType: List.ListProps.Type.ITEM},
    {
      label: 'Five (disabled)',
      rgItemType: List.ListProps.Type.ITEM,
      disabled: true,
    },
  ],
};

export const longList: StoryFn<ListAttrs> = args => <List {...args} />;

longList.storyName = 'long list';
longList.parameters = {screenshots: {skip: true}};
longList.args = {
  maxHeight: 400,
  compact: true,
  shortcuts: true,
  data: Array(1000)
    .fill(undefined)
    .map((_, i) => ({
      label: `Item ${i}`,
      rgItemType: List.ListProps.Type.ITEM,
    })),
};

export const list2: StoryFn<ListAttrs> = args => <List {...args} />;

list2.storyName = 'list #2';
list2.args = {
  shortcuts: true,
  renderOptimization: false,
  data: [
    {
      rgItemType: List.ListProps.Type.SEPARATOR,
      description: 'First separator',
    },
    {label: 'Item 1', rgItemType: List.ListProps.Type.ITEM},
    {
      rgItemType: List.ListProps.Type.SEPARATOR,
      description: 'Second sep',
    },
    {label: 'Item 2', rgItemType: List.ListProps.Type.ITEM},
    {
      rgItemType: List.ListProps.Type.TITLE,
      label: 'Group title',
      description: 'With description',
    },
    {
      label: 'Item 3',
      rgItemType: List.ListProps.Type.ITEM,
      description: 'Foo bar',
      hoverClassName: styles.hover,
    },
    {
      rgItemType: List.ListProps.Type.SEPARATOR,
    },
    {
      label: 'Item 4',
      rgItemType: List.ListProps.Type.ITEM,
      description: 'Item description',
    },
    {
      label: 'Item 5',
      rgItemType: List.ListProps.Type.ITEM,
      description: 'Item description',
      details: 'Additional details line',
    },
    {
      label: 'Item 6',
      rgItemType: List.ListProps.Type.ITEM,
      description: 'Item description',
      details:
        'Additional details line, a long long text. And once again, additional details line, a long long text. And once again, additional details line, a long long text. And once again, additional details line, a long long text. And once again, additional details line, a long long text.',
    },
  ],
};

export const withItemIcons: StoryFn<ListAttrs> = args => <List {...args} />;

withItemIcons.storyName = 'with item icons';
withItemIcons.args = {
  shortcuts: true,
  renderOptimization: false,
  data: [
    {
      label: 'Some item',
      description: 'Long long long long long long long long long long long long long long long description',
      key: '1',
      rgItemType: List.ListProps.Type.ITEM,
      glyph: warningIcon,
      rightGlyph: warningIcon,
    },
    {
      label: 'Some item with a long long label, much longer than description',
      key: '2',
      rgItemType: List.ListProps.Type.ITEM,
      description: 'Test item',
      icon: FLAG_EN_URL,
    },
    {
      label: 'Some item with a long long label',
      key: '3',
      rgItemType: List.ListProps.Type.ITEM,
      description: 'Long long long long long long long long long long long long long long long description',
      checkbox: true,
    },
    {
      label: 'Some item',
      key: '4',
      rgItemType: List.ListProps.Type.LINK,
      description: 'Test item',
      icon: FLAG_EN_URL,
    },
    {
      label: 'Some item',
      key: '5',
      href: 'http://localhost:9999',
      description: 'Test item',
      icon: FLAG_EN_URL,
    },
  ],
};

export const withDeprecatedItemTypeParameter: StoryFn<ListAttrs> = args => <List {...args} />;

withDeprecatedItemTypeParameter.storyName = 'with deprecated item.type parameter';
withDeprecatedItemTypeParameter.parameters = {screenshots: {skip: true}};
withDeprecatedItemTypeParameter.args = {
  shortcuts: true,
  data: [
    // @ts-expect-error testing a wrong usage
    {label: 'One', type: List.ListProps.Type.ITEM},
    // @ts-expect-error testing a wrong usage
    {label: 'Two', type: List.ListProps.Type.ITEM},
    // @ts-expect-error testing a wrong usage
    {label: 'Three', type: List.ListProps.Type.ITEM},
    // @ts-expect-error testing a wrong usage
    {label: 'Four', type: List.ListProps.Type.ITEM},
    // @ts-expect-error testing a wrong usage
    {label: 'Five', type: List.ListProps.Type.ITEM},
  ],
};

export const withCustomItems: StoryFn<ListAttrs> = args => <List {...args} />;

withCustomItems.storyName = 'with custom items';
withCustomItems.args = {
  shortcuts: true,
  renderOptimization: false,
  data: [
    {
      key: '1',
      rgItemType: List.ListProps.Type.CUSTOM,
      template: createElement('span', {}, 'custom item'),
    },
    {
      key: '2',
      rgItemType: List.ListProps.Type.CUSTOM,
      template: createElement('span', {}, 'custom item (disabled)'),
      disabled: true,
    },
    {
      key: '3',
      rgItemType: List.ListProps.Type.CUSTOM,
      template: createElement('span', {}, 'custom item 3'),
    },
  ],
};

export const WithUsers = () => {
  const [listData, setListData] = useState<ListDataItem[] | null>(null);
  const [selected, setSelected] = useState<ListDataItem | null>(null);
  useEffect(() => {
    const auth = new Auth(hubConfig);
    const source = new Source(auth);

    async function loadUsers() {
      await auth.init();
      const data = await source.getForList('ring', Source.Filter.USERS);
      setListData(data);
    }

    loadUsers();
  }, []);

  return listData ? (
    <ContentLayout>
      <Sidebar>
        <List className="list" data={listData} shortcuts onSelect={setSelected} />
      </Sidebar>
      {selected && <Code className="selected" language="json" code={JSON.stringify(selected, null, 2)} />}
    </ContentLayout>
  ) : (
    <Loader />
  );
};

WithUsers.storyName = 'with users';
WithUsers.parameters = {screenshots: {skip: true}};
WithUsers.tags = ['skip-test'];

export const withCustomTooltip: StoryFn<ListAttrs> = args => <List {...args} />;

withCustomTooltip.storyName = 'with custom tooltip';
withCustomTooltip.args = {
  shortcuts: true,
  renderOptimization: false,
  data: [
    {
      label: 'Custom Tooltip',
      key: 1,
      title: '',
      labelWrapper: children => <Tooltip title={'Custom Tooltip'}>{children}</Tooltip>,
    },
  ],
};

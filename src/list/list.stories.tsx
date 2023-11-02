import React from 'react';
import warningIcon from '@jetbrains/icons/warning';
import {Story} from '@storybook/react';

import hubConfig from '../../.storybook/hub-config';

import reactDecorator from '../../.storybook/react-decorator';

import Loader from '../loader/loader';
import Tooltip from '../tooltip/tooltip';
import Auth from '../auth/auth';
import Code from '../code/code';
import ContentLayout, {Sidebar} from '../content-layout/content-layout';


import List, {ListAttrs} from './list';
import Source from './list__users-groups-source';
import styles from './list.stories.css';
import {ListDataItem} from './consts';

const FLAG_EN_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKCAMAAACKYC6uAAAAB3RJTUUH3AIcDR8UFn+EAwAAAAlwSFlzAAAewQAAHsEBw2lUUwAAAARnQU1BAACxjwv8YQUAAAHgUExURf///9LAwLxiY51KVk1Pew0uch0pcImTtOBwdeVzeKasyEZQjDZHfWh3mK2xtq2Dg5NKT3OEqbi9xsWMjLBGS35YcCY8enWCptZkaOFtcaKpx1xsoa24ys++vrlyc5ZcZVJVdFRsoVFnlpqtv8i4ubpiZJ1jcamsvcRTWtFbYtPZ5+Tv9+/Q0Mp9gZqAkU1kjCtDc+vT2NW7wsClrMSnqsGgo8KSlMylpbM5Qr5FTfDOzvnb3O7JzOPCxcazuLafpbCYnddxeNZqcsBOVagsNZ0XIZsRG5wRHKUbJbErNcA8Rs5PWNRdZdFdZcNSWrFDSqg8Q6dFTN12fdFja7lGTqYnMZwTHZoOGJ4THagfKbUvOcRFTtBUXdRcZc5bY8BPV69BSJeCh8CrsOzY3ubFx86ipcmpqsWhoZ8iK6MjLNKnqdyoqurKzfXb3ObM09rAx82zuA4jTkRafrWhseadoefDwsHL05+ot6cuNqcoMKKjtKhwftmDhvTj49Hi8XWLuE5mnCkuSnJASa1sbsjS4lFglW13mbE6P64rMGNtkCA3do9thtNxdvK6u+ns846fxGwrL3pSUpCSlnF/nGp7rldgmoiQrrhHS68vM2hvkAUTXBAwdGRrlcR6huyWmPzp6TUvvy8AAAABdFJOUwBA5thmAAAAtUlEQVR42gGqAFX/AJCRkpOUlZaXmJmam5ydnp8AgYKDfYSFhoeIiYqLjI2OjwBxcnN0dXZ3eHl6e3x9fn+AAGFiY2RlZmdoaWprbG1ub3AAUVJTVFVWV1hZWltcXV5fYABBQkNERUZHSElKS0xNTk9QADEyMzQ1Njc4OTo7PD0+P0AAISIjJCUmJygpKissLS4vMAAREhMUFRYXGBkaGxwdHh8gAAECAwQFBgcICQoLDA0ODxAO4zIu3IgQpAAAAABJRU5ErkJggg==';

export default {
  title: 'Components/List',
  decorators: [reactDecorator()],

  parameters: {
    component: List,
    framework: 'react',
    hermione: {captureSelector: '*[data-test~=ring-list]'}
  }
};

export const basic: Story<ListAttrs> = args => <List {...args}/>;

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
    {label: 'Five', key: 5, rgItemType: List.ListProps.Type.ITEM}
  ]
};

export const withAHintBelow: Story<ListAttrs> = args => <List {...args}/>;

withAHintBelow.storyName = 'with a hint below';
withAHintBelow.args = {
  shortcuts: true,
  activeIndex: 2,
  hint: 'Hint about the list',
  renderOptimization: false,
  data: [
    {label: 'One', rgItemType: List.ListProps.Type.ITEM},
    {label: 'Two', rgItemType: List.ListProps.Type.ITEM},
    {label: 'Active as default', rgItemType: List.ListProps.Type.ITEM},
    {label: 'Four', rgItemType: List.ListProps.Type.ITEM},
    {
      label: 'Five (disabled)',
      rgItemType: List.ListProps.Type.ITEM,
      disabled: true
    }
  ]
};

export const longList: Story<ListAttrs> = args => <List {...args}/>;

longList.storyName = 'long list';
longList.parameters = {hermione: {skip: true}};
longList.args = {
  maxHeight: 400,
  compact: true,
  shortcuts: true,
  data: Array(1000).fill(undefined).map((_, i) => ({
    label: `Item ${i}`,
    rgItemType: List.ListProps.Type.ITEM
  }))
};

export const list2: Story<ListAttrs> = args => <List {...args}/>;

list2.storyName = 'list #2';
list2.args = {
  shortcuts: true,
  renderOptimization: false,
  data: [
    {
      rgItemType: List.ListProps.Type.SEPARATOR,
      description: 'First separator'
    },
    {label: 'Item 1', rgItemType: List.ListProps.Type.ITEM},
    {
      rgItemType: List.ListProps.Type.SEPARATOR,
      description: 'Second sep'
    },
    {label: 'Item 2', rgItemType: List.ListProps.Type.ITEM},
    {
      rgItemType: List.ListProps.Type.TITLE,
      label: 'Group title',
      description: 'With description'
    },
    {
      label: 'Item 3',
      rgItemType: List.ListProps.Type.ITEM,
      description: 'Foo bar',
      hoverClassName: styles.hover
    },
    {
      rgItemType: List.ListProps.Type.SEPARATOR
    },
    {
      label: 'Item 4',
      rgItemType: List.ListProps.Type.ITEM,
      description: 'Item description'
    },
    {
      label: 'Item 5',
      rgItemType: List.ListProps.Type.ITEM,
      description: 'Item description',
      details: 'Additional details line'
    },
    {
      label: 'Item 6',
      rgItemType: List.ListProps.Type.ITEM,
      description: 'Item description',
      details:
        'Additional details line, a long long text. And once again, additional details line, a long long text. And once again, additional details line, a long long text. And once again, additional details line, a long long text. And once again, additional details line, a long long text.'
    }
  ]
};

export const withItemIcons: Story<ListAttrs> = args => <List {...args}/>;

withItemIcons.storyName = 'with item icons';
withItemIcons.args = {
  shortcuts: true,
  renderOptimization: false,
  data: [
    {
      label: 'Some item',
      description:
        'Long long long long long long long long long long long long long long long description',
      key: '1',
      rgItemType: List.ListProps.Type.ITEM,
      glyph: warningIcon,
      rightGlyph: warningIcon
    },
    {
      label: 'Some item with a long long label, much longer than description',
      key: '2',
      rgItemType: List.ListProps.Type.ITEM,
      description: 'Test item',
      icon: FLAG_EN_URL
    },
    {
      label: 'Some item with a long long label',
      key: '3',
      rgItemType: List.ListProps.Type.ITEM,
      description:
        'Long long long long long long long long long long long long long long long description',
      checkbox: true
    },
    //Link doesn't support icons
    {
      label: 'Some item',
      key: '4',
      rgItemType: List.ListProps.Type.LINK,
      description: 'Test item',
      icon: FLAG_EN_URL
    },
    {
      label: 'Some item',
      key: '5',
      href: 'http://localhost:9999',
      description: 'Test item',
      icon: FLAG_EN_URL
    }
  ]
};

export const withDeprecatedItemTypeParameter: Story<ListAttrs> = args => <List {...args}/>;

withDeprecatedItemTypeParameter.storyName = 'with deprecated item.type parameter';
withDeprecatedItemTypeParameter.parameters = {hermione: {skip: true}};
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
    {label: 'Five', type: List.ListProps.Type.ITEM}
  ]
};

export const withCustomItems: Story<ListAttrs> = args => <List {...args}/>;

withCustomItems.storyName = 'with custom items';
withCustomItems.args = {
  shortcuts: true,
  renderOptimization: false,
  data: [
    {
      key: '1',
      rgItemType: List.ListProps.Type.CUSTOM,
      template: React.createElement('span', {}, 'custom item')
    },
    {
      key: '2',
      rgItemType: List.ListProps.Type.CUSTOM,
      template: React.createElement('span', {}, 'custom item (disabled)'),
      disabled: true
    },
    {
      key: '3',
      rgItemType: List.ListProps.Type.CUSTOM,
      template: React.createElement('span', {}, 'custom item 3')
    }
  ]
};

class UserList extends React.Component {
  state = {
    listData: null,
    selected: null
  };

  componentDidMount() {
    this.loadUsers();
  }

  auth = new Auth(hubConfig);
  source = new Source(this.auth);

  async loadUsers() {
    await this.auth.init();
    const listData = await this.source.getForList('ring', Source.Filter.USERS);
    this.setState({listData});
  }

  handleSelect = (selected: ListDataItem) => this.setState({selected});

  render() {
    const {listData, selected} = this.state;
    return listData
      ? (
        <ContentLayout>
          <Sidebar>
            <List
              className="list"
              data={listData}
              shortcuts
              onSelect={this.handleSelect}
            />
          </Sidebar>
          {selected && (
            <Code className="selected" language="json" code={JSON.stringify(selected, null, 2)}/>
          )}
        </ContentLayout>
      )
      : <Loader/>;
  }
}

export const withUsers = () => <UserList/>;

withUsers.storyName = 'with users';
withUsers.parameters = {hermione: {skip: true}};

export const withCustomTooltip: Story<ListAttrs> = args => <List {...args}/>;

withCustomTooltip.storyName = 'with custom tooltip';
withCustomTooltip.args = {
  shortcuts: true,
  renderOptimization: false,
  data: [
    {label: 'Custom Tooltip', key: 1, title: '', labelWrapper: children => <Tooltip title={'Custom Tooltip'}>{children}</Tooltip>}
  ]
};

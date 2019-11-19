import React from 'react';
import {action} from '@storybook/addon-actions';

import hubConfig from '../../.storybook/hub-config';

import {WarningIcon} from '../icon';
import Loader from '../loader/loader';
import Auth from '../auth/auth';
import Code from '../code/code';
import ContentLayout, {Sidebar} from '../content-layout/content-layout';

import reactDecorator from '../../.storybook/react-decorator';

import List from './list';
import Source from './list__users-groups-source';

const FLAG_EN_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKCAMAAACKYC6uAAAAB3RJTUUH3AIcDR8UFn+EAwAAAAlwSFlzAAAewQAAHsEBw2lUUwAAAARnQU1BAACxjwv8YQUAAAHgUExURf///9LAwLxiY51KVk1Pew0uch0pcImTtOBwdeVzeKasyEZQjDZHfWh3mK2xtq2Dg5NKT3OEqbi9xsWMjLBGS35YcCY8enWCptZkaOFtcaKpx1xsoa24ys++vrlyc5ZcZVJVdFRsoVFnlpqtv8i4ubpiZJ1jcamsvcRTWtFbYtPZ5+Tv9+/Q0Mp9gZqAkU1kjCtDc+vT2NW7wsClrMSnqsGgo8KSlMylpbM5Qr5FTfDOzvnb3O7JzOPCxcazuLafpbCYnddxeNZqcsBOVagsNZ0XIZsRG5wRHKUbJbErNcA8Rs5PWNRdZdFdZcNSWrFDSqg8Q6dFTN12fdFja7lGTqYnMZwTHZoOGJ4THagfKbUvOcRFTtBUXdRcZc5bY8BPV69BSJeCh8CrsOzY3ubFx86ipcmpqsWhoZ8iK6MjLNKnqdyoqurKzfXb3ObM09rAx82zuA4jTkRafrWhseadoefDwsHL05+ot6cuNqcoMKKjtKhwftmDhvTj49Hi8XWLuE5mnCkuSnJASa1sbsjS4lFglW13mbE6P64rMGNtkCA3do9thtNxdvK6u+ns846fxGwrL3pSUpCSlnF/nGp7rldgmoiQrrhHS68vM2hvkAUTXBAwdGRrlcR6huyWmPzp6TUvvy8AAAABdFJOUwBA5thmAAAAtUlEQVR42gGqAFX/AJCRkpOUlZaXmJmam5ydnp8AgYKDfYSFhoeIiYqLjI2OjwBxcnN0dXZ3eHl6e3x9fn+AAGFiY2RlZmdoaWprbG1ub3AAUVJTVFVWV1hZWltcXV5fYABBQkNERUZHSElKS0xNTk9QADEyMzQ1Njc4OTo7PD0+P0AAISIjJCUmJygpKissLS4vMAAREhMUFRYXGBkaGxwdHh8gAAECAwQFBgcICQoLDA0ODxAO4zIu3IgQpAAAAABJRU5ErkJggg==';

export default {
  title: 'Components|List',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a list of items.',
    hermione: {captureSelector: '*[data-test~=ring-list]'}
  }
};

export const basic = () => {
  const listData = [
    {label: 'One', key: 1, href: 'http://example.com', rgItemType: List.ListProps.Type.LINK},
    {label: <b>foo</b>, key: 2, rgItemType: List.ListProps.Type.ITEM},
    {label: 'Active as default', key: 3, rgItemType: List.ListProps.Type.ITEM},
    {label: 'Four', key: 4, rgItemType: List.ListProps.Type.ITEM},
    {label: 'Five', key: 5, rgItemType: List.ListProps.Type.ITEM}
  ];

  return (
    <List
      data={listData}
      activeIndex={2}
      shortcuts
      onSelect={action('selected')}
      renderOptimization={false}
    />
  );
};

basic.story = {
  name: 'basic'
};

export const withAHintBelow = () => {
  const listData = [
    {label: 'One', rgItemType: List.ListProps.Type.ITEM},
    {label: 'Two', rgItemType: List.ListProps.Type.ITEM},
    {label: 'Active as default', rgItemType: List.ListProps.Type.ITEM},
    {label: 'Four', rgItemType: List.ListProps.Type.ITEM},
    {
      label: 'Five (disabled)',
      rgItemType: List.ListProps.Type.ITEM,
      disabled: true
    }
  ];

  return (
    <List
      data={listData}
      shortcuts
      onSelect={action('selected')}
      activeIndex={2}
      hint="Hint about the list"
      renderOptimization={false}
    />
  );
};

withAHintBelow.story = {
  name: 'with a hint below'
};

export const longList = () => {
  const listData = [];
  for (let i = 0; i < 1000; i++) {
    listData.push({
      label: `Item ${i}`,
      rgItemType: List.ListProps.Type.ITEM
    });
  }

  return <List maxHeight={400} data={listData} shortcuts compact onSelect={action('selected')}/>;
};

longList.story = {
  name: 'long list',
  parameters: {hermione: {skip: true}}
};

export const list2 = () => {
  const listData = [
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
      description: 'Foo bar'
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
  ];

  return (
    <List data={listData} shortcuts onSelect={action('selected')} renderOptimization={false}/>
  );
};

list2.story = {
  name: 'list #2'
};

export const withItemIcons = () => {
  const listData = [
    {
      label: 'Some item',
      description:
        'Long long long long long long long long long long long long long long long description',
      key: '1',
      rgItemType: List.ListProps.Type.ITEM,
      glyph: WarningIcon,
      rightGlyph: WarningIcon
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
  ];

  return (
    <List data={listData} shortcuts onSelect={action('selected')} renderOptimization={false}/>
  );
};

withItemIcons.story = {
  name: 'with item icons'
};

export const withDeprecatedItemTypeParameter = () => {
  const listData = [
    {label: 'One', type: List.ListProps.Type.ITEM},
    {label: 'Two', type: List.ListProps.Type.ITEM},
    {label: 'Three', type: List.ListProps.Type.ITEM},
    {label: 'Four', type: List.ListProps.Type.ITEM},
    {label: 'Five', type: List.ListProps.Type.ITEM}
  ];

  return <List data={listData} shortcuts onSelect={action('selected')}/>;
};

withDeprecatedItemTypeParameter.story = {
  name: 'with deprecated item.type parameter',
  parameters: {hermione: {skip: true}}
};

export const withCustomItems = () => {
  const listData = [
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
  ];

  return (
    <List data={listData} shortcuts onSelect={action('selected')} renderOptimization={false}/>
  );
};

withCustomItems.story = {
  name: 'with custom items'
};

export const withUsers = () => {
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

    handleSelect = selected => this.setState({selected});

    render() {
      const {listData, selected} = this.state;
      return listData ? (
        <ContentLayout>
          <Sidebar>
            <List
              className="list"
              data={this.state.listData}
              shortcuts
              onSelect={this.handleSelect}
            />
          </Sidebar>
          {selected && (
            <Code className="selected" language="json" code={JSON.stringify(selected, null, 2)}/>
          )}
        </ContentLayout>
      ) : (
        <Loader/>
      );
    }
  }

  return <UserList/>;
};

withUsers.story = {
  name: 'with users',
  parameters: {hermione: {skip: true}}
};

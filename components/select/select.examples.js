import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {storiesOf} from '@storybook/html';
import {action} from '@storybook/addon-actions';
import {withKnobs, boolean} from '@storybook/addon-knobs';

import reactDecorator from '../../.storybook/react-decorator';
import hubConfig from '../../.storybook/hub-config';
import {WarningIcon} from '../icon';
import Link from '../link/link';
import Popup from '../popup/popup';
import List from '../list/list';
import Auth from '../auth/auth';
import Source from '../list/list__users-groups-source';
import '../input-size/input-size.scss';

import Select from './select';

const FLAG_DE_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAUCAIAAACMMcMmAAAAKklEQVRIx2NgGAWjgAbAh/aI4S7t0agdI9COzx00Rwz/z9Ecjdox8uwAACkGSkKIaGlAAAAAAElFTkSuQmCC';

storiesOf('Components|Select', module).
  addParameters({
    notes: 'Displays a select.'
  }).
  addDecorator(reactDecorator()).
  add('with a filter and tags', () => {
    const selectProps = {
      multiple: true,
      filter: {
        placeholder: 'Search'
      },
      tags: {
        reset: {
          separator: true,
          label: 'Reset the list',
          glyph: WarningIcon
        }
      }
    };

    const avatarUrl = `${hubConfig.serverUri}/api/rest/avatar/default?username=blue`;

    const tags = [
      {label: 'One', key: '1', type: 'user', readOnly: true},
      {label: 'Two', key: '2', type: 'user', readOnly: false},
      {label: 'Three', key: '3', type: 'user'},
      {
        label: 'With icon',
        key: 4,
        icon: FLAG_DE_URL
      },
      {
        label: 'With avatar',
        key: 5,
        avatar: avatarUrl
      }
    ];

    const data = {
      data: tags,
      selected: [tags[0]]
    };

    return (<Select {...selectProps} {...data}/>);
  }, {hermione: {skip: true}}).

  add('with a filter', () => {
    class SelectExample extends Component {

      static propTypes = {
        data: PropTypes.arrayOf(Object)
      };

      constructor(props) {
        super(props);
        this.state = {selected: props.data[0]};
      }

      clearSelection = () => {
        this.setState({selected: null});
      };

      onSelect = option => {
        this.setState({selected: option});
      };

      render() {
        return (
          <>
            <div className="demo">
              <Select
                selectedLabel="Option"
                label="Please select option"
                filter
                clear
                selected={this.state.selected}
                data={this.props.data}
                onSelect={this.onSelect}
              />
            </div>

            <>
              <Link pseudo onClick={this.clearSelection}>
                Clear
              </Link>
            </>
          </>
        );
      }
    }

    const data = [
      {label: 'One', key: '1', type: 'user'},
      {label: 'Group', key: '2', description: 'Long descriptions', type: 'user'},
      {label: 'Three', key: '3', type: 'user'},
      {label: 'With icon', key: 4, icon: FLAG_DE_URL}
    ];

    return <SelectExample data={data}/>;
  }, {
    hermione: {
      actions: [
        {type: 'click', selector: '[data-test~=ring-select]'},
        {type: 'capture', name: 'selectWithPopup', selector: ['[data-test=ring-select]', '[data-test~=ring-popup]']}
      ]
    },
    storyStyles: `
<style>
  .demo {
    padding: 16px 0;
  }
</style>
      `
  }).

  add('button mode with a filter', () => {
    class SelectExample extends Component {

      static propTypes = {
        data: PropTypes.arrayOf(Object)
      };

      constructor(props) {
        super(props);
        this.state = {selected: props.data[0]};
      }

      clearSelection = () => {
        this.setState({selected: null});
      };

      onSelect = option => {
        this.setState({selected: option});
      };

      render() {
        return (
          <>
            <div className="demo">
              <Select
                type={Select.Type.BUTTON}
                selectedLabel="Option"
                label="Please select option"
                filter
                clear
                selected={this.state.selected}
                data={this.props.data}
                onSelect={this.onSelect}
              />
            </div>

            <>
              <Link pseudo onClick={this.clearSelection}>
                Clear
              </Link>
            </>
          </>
        );
      }
    }

    const data = [
      {label: 'One', key: '1', type: 'user'},
      {label: 'Group', key: '2', description: 'Long descriptions', type: 'user'},
      {label: 'Three', key: '3', type: 'user'},
      {label: 'With icon', key: 4, icon: FLAG_DE_URL}
    ];

    return <SelectExample data={data}/>;
  }, {
    hermione: {captureSelector: '*[data-test~=ring-select]'},
    storyStyles: `
<style>
  .demo {
    margin: 32px 0 16px 0;
  }
</style>
      `
  }).

  add('inline with a filter', () => {
    class SelectExample extends Component {

      static propTypes = {
        data: PropTypes.arrayOf(Object)
      };

      constructor(props) {
        super(props);
        this.state = {selected: props.data[0]};
      }

      clearSelection = () => {
        this.setState({selected: null});
      };

      onSelect = option => {
        this.setState({selected: option});
      };

      render() {
        return (
          <>
            <div className="demo">
              {'Selected option is '}
              <Select
                key="select"
                type={Select.Type.INLINE}
                filter
                clear
                selected={this.state.selected}
                data={this.props.data}
                onSelect={this.onSelect}
              />
            </div>

            <>
              <Link pseudo onClick={this.clearSelection}>
                Clear
              </Link>
            </>
          </>
        );
      }
    }

    const data = [
      {label: 'One', key: '1', type: 'user'},
      {label: 'Group', key: '2', type: 'user'},
      {label: 'Three', key: '3', type: 'user'}
    ];

    return <SelectExample data={data}/>;
  }, {
    hermione: {
      actions: [
        {type: 'click', selector: '[data-test~=ring-select]'},
        {type: 'capture', name: 'selectWithPopup', selector: ['[data-test=ring-select]', '[data-test~=ring-popup]']}
      ]
    },
    storyStyles: `
<style>
  .demo {
    margin: 16px 0;
  }
</style>
      `
  }).

  add('inline (opens to left)', () => {
    class SelectExample extends Component {

      static propTypes = {
        data: PropTypes.arrayOf(Object)
      };

      constructor(props) {
        super(props);
        this.state = {selected: props.data[0]};
      }

      clearSelection = () => {
        this.setState({selected: null});
      };

      onSelect = option => {
        this.setState({selected: option});
      };

      render() {
        return (
          <div className="demo-container">
            <div className="demo">
              {'Selected option is '}
              <Select
                key="select"
                type={Select.Type.INLINE}
                filter
                clear
                selected={this.state.selected}
                data={this.props.data}
                onSelect={this.onSelect}
                directions={[Popup.PopupProps.Directions.BOTTOM_LEFT]}
              />
            </div>

            <>
              <Link pseudo onClick={this.clearSelection}>
                Clear
              </Link>
            </>
          </div>
        );
      }
    }

    const data = [
      {label: 'One', key: '1', type: 'user'},
      {label: 'Group', key: '2', type: 'user'},
      {label: 'Three', key: '3', type: 'user'}
    ];

    return <SelectExample data={data}/>;
  }, {
    hermione: {skip: true},
    storyStyles: `
<style>
  .demo-container {
    padding: 8px;
    padding-left: 128px;
    width: 50%;
  }

  .demo {
    margin: 16px 0;
  }
</style>
      `
  }).
  add('with disabled move overflow', () => {
    class SelectExample extends Component {

      static propTypes = {
        data: PropTypes.arrayOf(Object)
      };

      constructor(props) {
        super(props);
        this.state = {selected: props.data[0]};
      }

      clearSelection = () => {
        this.setState({selected: null});
      };

      onSelect = option => {
        this.setState({selected: option});
      };

      render() {
        return (
          <div className="demo-container">
            <div className="demo">
              <Select
                selectedLabel="Option"
                label="Please select option"
                filter
                clear
                selected={this.state.selected}
                data={this.props.data}
                onSelect={this.onSelect}
                disableMoveOverflow
              />
            </div>

            <>
              <Link pseudo onClick={this.clearSelection}>
                Clear
              </Link>
            </>
          </div>
        );
      }
    }

    const data = [
      {label: 'One', key: '1', type: 'user'},
      {label: 'Group', key: '2', type: 'user'},
      {label: 'Three', key: '3', type: 'user'}
    ];

    return <SelectExample data={data}/>;
  }, {
    hermione: {skip: true},
    storyStyles: `
<style>
  .demo-container {
    padding: 8px;
    width: 50%;
  }

  .demo {
    margin: 16px 0;
  }
</style>`
  }).

  add('with server-side filtering', () => {
    const alwaysTrue = () => true;

    class UserList extends Component {
      state = {
        users: [],
        request: null
      };

      componentDidMount() {
        this.initialize();
      }

      auth = new Auth(hubConfig);

      source = new Source(this.auth, {
        searchMax: 8
      });

      initialize = async () => {
        await this.auth.init();
        await this.loadData();
      };

      loadData = async query => {
        const request = this.source.getForList(query);
        this.setState({request});

        const users = await request;

        // only the latest request is relevant
        if (this.state.request === request) {
          this.setState({
            users,
            request: null
          });
        }
      };

      render() {
        return (
          <Select
            data={this.state.users}
            label="Set owner"
            selectedLabel="Owner"
            filter={{
              placeholder: 'Search user or group',
              fn: alwaysTrue // disable client filtering
            }}
            onFilter={this.loadData}
            loading={!!this.state.request}
          />
        );
      }
    }

    return <UserList/>;
  }, {hermione: {skip: true}}).

  add('with fuzzy search filter', () => {
    class SelectExample extends Component {

      static propTypes = {
        data: PropTypes.arrayOf(Object)
      };

      constructor(props) {
        super(props);
        this.state = {selected: props.data[0]};
      }

      clearSelection = () => {
        this.setState({selected: null});
      };

      onSelect = option => {
        this.setState({selected: option});
      };

      render() {
        return (
          <div className="demo-container">
            <div className="demo">
              <Select
                selectedLabel="Option"
                label="Please select option"
                filter={{fuzzy: true}}
                clear
                selected={this.state.selected}
                data={this.props.data}
                onSelect={this.onSelect}
              />
            </div>

            <>
              <Link pseudo onClick={this.clearSelection}>
                Clear
              </Link>
            </>
          </div>
        );
      }
    }

    const data = [
      {label: 'One', key: '1', type: 'user'},
      {label: 'Group', key: '2', type: 'user'},
      {label: 'Three', key: '3', type: 'user'},
      {label: 'With icon', key: 4, icon: FLAG_DE_URL}
    ];

    return <SelectExample data={data}/>;
  }, {
    hermione: {skip: true},
    storyStyles: `
<style>
  .demo {
    margin: 32px 0 16px 0;
  }
</style>
      `
  }).

  add('with a large dataset', () => {
    const elementsNum = 100000;
    const selectedIndex = elementsNum / 2;
    const dataset = [...Array(elementsNum)].map(
      (elem, idx) => ({
        label: `element ${idx}`,
        key: idx,
        type: 'user'
      })
    );

    return (
      <Select
        filter
        compact
        selected={dataset[selectedIndex]}
        data={dataset}
        disableScrollToActive={boolean('Disable scroll to active item', false)}
      />
    );
  }, {decorators: [withKnobs], hermione: {skip: true}}).

  add('multiple with a description', () => {
    const deFlag = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAUCAIAAACMMcMmAAAAKklEQVRIx2NgGAWjgAbAh/aI4S7t0agdI9COzx00Rwz/z9Ecjdox8uwAACkGSkKIaGlAAAAAAElFTkSuQmCC';
    const ruFlag = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAYAAACaq43EAAAAOUlEQVR42u3TUQ0AIAwD0aIGt5OFBtx0mCBNljsD7+uWXwoEDPwPrvKJwJINDDwLvtqZnSwZGHgU3Kx2NIuI4wdUAAAAAElFTkSuQmCC';
    const avatarUrl = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50IiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNCMzQ1RjEiIG9mZnNldD0iMCIvPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjNjY5REZGIiBvZmZzZXQ9IjEiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgogICAgPGc+CiAgICAgICAgPHJlY3QgZmlsbD0idXJsKCNncmFkaWVudCkiCiAgICAgICAgICAgICAgeD0iMCIgeT0iMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IgogICAgICAgICAgICAgIHJ4PSIzIiByeT0iMyIvPgogICAgICAgIDx0ZXh0IHg9IjIiIHk9IjEzIgogICAgICAgICAgICAgIGZvbnQtZmFtaWx5PSJBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmIgogICAgICAgICAgICAgIGZvbnQtc2l6ZT0iMTFweCIKICAgICAgICAgICAgICBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPHRzcGFuPkJMPC90c3Bhbj4KICAgICAgICAgICAgPHRzcGFuIHg9IjMiIHk9IjE3Ij5fPC90c3Bhbj4KICAgICAgICA8L3RleHQ+CiAgICA8L2c+Cjwvc3ZnPg==';
    const icons = [deFlag, ruFlag, undefined];

    const elementsNum = 5;
    const dataset = [...Array(elementsNum)].map(
      (elem, idx) => ({
        label: `element ${idx}`,
        key: idx,
        description: `description ${idx}`,
        icon: icons[idx % 3],
        avatar: idx % 2 ? avatarUrl : null
      })
    );

    return <Select filter selected={[dataset[0], dataset[3]]} multiple data={dataset}/>;
  }, {
    hermione: {
      actions: [
        {type: 'click', selector: '[data-test~=ring-select]'},
        {type: 'capture', name: 'selectWithPopup', selector: ['[data-test=ring-select]', '[data-test~=ring-popup]']}
      ]
    }
  }).

  add('disabled', () => (
    <div>
      <div className="demo-wrapper">
        <Select disabled loading/>
      </div>
      <div className="demo-wrapper">
        <Select disabled loading type={Select.Type.BUTTON}/>
      </div>
    </div>
  ), {
    storyStyles: `
<style>
  .demo-wrapper {
    margin: 8px;
  }
</style>
      `
  }).

  add('input-based', () => {
    const data = [...Array(20)].map(
      (elem, idx) => ({label: `Item ${idx}`, key: idx})
    );

    return <Select type={Select.Type.INPUT} data={data} clear/>;
  }, {
    hermione: {
      actions: [
        {type: 'click', selector: '[data-test~=ring-input]'},
        {type: 'capture', name: 'selectWithPopup', selector: ['[data-test=ring-select]', '[data-test~=ring-popup]']}
      ]
    }
  }).

  add('input-based in suggest-only mode', () => {
    const data = [...Array(20)].map(
      (elem, idx) => ({label: `Item ${idx}`, key: idx})
    );

    return (
      <Select
        type={Select.Type.INPUT}
        allowAny
        hideArrow
        label="Placeholder without arrow"
        data={data}
        selected={data[1]}
      />
    );
  }, {hermione: {skip: true}}).

  add('with sub levels for list element', () => {
    const data = [
      {label: 'One', key: '1'},
      {label: 'Two', key: '2', disabled: true},
      {label: 'Two One', key: '2.1', level: 1},
      {label: 'Two Two', key: '2.2', level: 1},
      {label: 'Three', key: '3'}
    ];

    return (<Select filter data={data}/>);
  }, {hermione: {skip: true}}).

  add('with default filter mode and a loading indicator', () => {
    const data = [
      {label: 'One', key: '1'},
      {label: 'Group', key: '2'},
      {label: 'Three', key: '3'}
    ];

    return (<Select filter loading data={data} selected={data[1]}/>);
  }, {hermione: {skip: true}}).

  add('with a customized filter and an \'Add item\' button', () => {
    const data = [...Array(100)].map(
      (elem, idx) => ({
        label: `Item long long long long long long long long label ${idx}`,
        key: idx
      })
    );

    return (
      <Select
        filter={{
          placeholder: 'Select me',
          value: 'One'
        }}
        hint="Press down to do something"
        add={{
          prefix: 'Add name'
        }}
        onAdd={action('added')}
        data={data}
        selected={data[49]}
        onSelect={action('selected')}
      />
    );
  }, {hermione: {skip: true}}).

  add('with custom items and an \'Add item\' button', () => {
    const data = [...Array(100)].map(
      (elem, idx) => {
        const label = `Label ${idx}`;
        return {
          label,
          key: label,
          template: <span className="label">{label}</span>,
          rgItemType: List.ListProps.Type.CUSTOM
        };
      }
    );

    return (
      <Select
        filter
        hint="Press down to do something"
        add={{
          prefix: 'Add label'
        }}
        onAdd={action('added')}
        data={data}
        onSelect={action('selected')}
      />
    );
  }, {
    hermione: {skip: true},
    storyStyles: `
<style>
  .label {
    border-radius: 3px;
    color: #669ECC;
    background-color: #E5F4FF;
    padding-left: 8px;
    margin: 2px 0;
  }
</style>
      `
  }).

  add('with an always visible \'Add item\' button', () => {
    const data = [...Array(10)].map(
      (elem, idx) => ({
        key: idx, label: `Item ${idx}`
      })
    );

    return (
      <Select
        filter={{
          placeholder: 'Select me',
          value: 'One'
        }}
        add={{
          alwaysVisible: true,
          label: 'Create New Blah Blah'
        }}
        onAdd={action('added')}
        data={data}
        onSelect={action('selected')}
      />
    );
  }, {hermione: {skip: true}}).

  add('multiple with custom view', () => {
    const data = [
      {label: 'One long label', key: '1'},
      {label: 'Two long label', key: '2'},
      {label: 'Three long label', key: '3'}
    ];

    const multipleConfig = {label: 'Change selected items', removeSelectedItems: false};

    return (
      <Select
        filter
        add={{
          prefix: 'Add some item'
        }}
        multiple={multipleConfig}
        selected={[data[1]]}
        data={data}
        onSelect={action('selected')}
        onDeselect={action('deselected')}
        onChange={action('changed-selection')}
      />
    );
  }, {hermione: {skip: true}}).

  add('as a dropdown without filter', () => {
    const data = [...Array(20)].map(
      (elem, idx) => ({
        label: `Item ${idx}`,
        description: `Description for the item lalalalala ${idx}`,
        key: idx
      })
    );

    return (
      <Select
        type={Select.Type.CUSTOM}
        data={data}
        label="Click me"
        customAnchor={({wrapperProps, buttonProps, popup}) => (
          <span {...wrapperProps}>
            <button type="button" {...buttonProps}/>
            {popup}
          </span>
        )}
      />
    );
  }, {hermione: {skip: true}}, {hermione: {skip: true}}).

  add('with render optimization', () => {
    const data = [...Array(1000)].map(
      (item, idx) => ({
        label: `Label ${idx}`,
        key: idx,
        rgItemType: idx % 10 ? List.ListProps.Type.ITEM : List.ListProps.Type.TITLE
      })
    );

    return <Select filter data={data}/>;
  }, {hermione: {skip: true}}).

  add('fits to screen', () => {
    const dataset = [...Array(1000)].map(
      (item, idx) => ({
        label: `element ${idx}`,
        key: idx,
        type: 'user'
      })
    );
    const selectedIndex = dataset.length / 2;

    return (
      <div className="demo">
        <Select
          maxHeight={5000}
          filter
          compact
          selected={dataset[selectedIndex]}
          data={dataset}
        />
      </div>
    );
  }, {
    hermione: {skip: true},
    storyStyles: `
<style>
  .demo {
    position: absolute;
    bottom: 20px;
  }
</style>
      `
  }).

  add('with filtered fields', () => {
    class SelectWrapper extends Component {
      constructor(props) {
        super(props);

        const data = [...Array(100)].map(
          (item, idx) => {
            const label = `Label ${idx}`;
            return {
              key: idx,
              label,
              template: <span className="label">{label}</span>,
              rgItemType: List.ListProps.Type.CUSTOM
            };
          }
        );

        const filtersData = [
          {label: 'Show odd', key: '1'},
          {label: 'Show even', key: '2'},
          {label: 'Show all', key: '3'}
        ];

        this.state = {
          data,
          filtersData,
          filteredData: data.filter(item => item.key % 2),
          selectedDataKey: null,
          selectedFilterKey: filtersData[0].key
        };
      }

      handleFilterSelect = selected => {
        const {data} = this.state;

        const filteredData = selected.label === 'Show all'
          ? [...data]
          : data.filter(
            item => !!(item.key % 2) === (selected.label === 'Show odd')
          );

        this.setState({
          filteredData,
          selectedFilterKey: selected.key,
          selectedDataKey: null
        });
      };

      handleDataSelect = selected =>
        this.setState({selectedDataKey: selected && selected.key});

      render() {
        const {filteredData, filtersData, selectedFilterKey, selectedDataKey} = this.state;
        return (
          <div className="filters-block">
            <Select
              selectedLabel="Filter"
              label="Please select filter"
              filter
              clear
              selected={filtersData.filter(item => item.key === selectedFilterKey)[0]}
              onSelect={this.handleFilterSelect}
              data={filtersData}
            />
            <Select
              selectedLabel="Option"
              label="Please select option"
              filter
              clear
              selected={filteredData.filter(item => item.key === selectedDataKey)[0]}
              onSelect={this.handleDataSelect}
              data={filteredData}
            />
          </div>
        );
      }
    }

    return <SelectWrapper/>;
  }, {
    hermione: {skip: true},
    storyStyles: `
<style>
    .filters-block {
      padding: 8px 0;
    }
    
    .filters-block > *:not(:nth-of-type(1)) {
      margin-left: 20px;
    }
</style>
      `
  });


import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import hubConfig from '../../packages/docs/components/hub-config';
import {WarningIcon} from '../icon';
import Link from '../link/link';
import '../input-size/input-size.scss';

import Select from './select';

storiesOf('Components|Select', module).
  addDecorator(reactDecorator()).
  add('Select with a filter and tags', () => {
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
      {label: 'Two', key: '2', type: 'user', readOnly: true},
      {label: 'Three', key: '3', type: 'user'},
      {
        label: 'With icon',
        key: 4,
        icon: 'http://flagpedia.net/data/flags/mini/de.png'
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
  }).

  add('Select with a filter', () => {
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
      {label: 'With icon', key: 4, icon: 'http://flagpedia.net/data/flags/mini/de.png'}
    ];

    return <SelectExample data={data}/>;
  }, {
    cssresources: [{
      id: 'example-styles',
      picked: true,
      code: `
<style>
  body {
    padding: 8px;
    width: 50%;
  }

  :global(.demo) {
    margin: 16px 0;
  }
</style>
      `
    }]
  });



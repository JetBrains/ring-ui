import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';
import hubConfig from '../../packages/docs/components/hub-config';
import {WarningIcon} from '../icon';
import Link from '../link/link';
import Popup from '../popup/popup';
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
  .demo {
    padding: 16px 0;
  }
</style>
      `
    }]
  }).

  add('Select-button with a filter', () => {
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
      {label: 'With icon', key: 4, icon: 'http://flagpedia.net/data/flags/mini/de.png'}
    ];

    return <SelectExample data={data}/>;
  }, {
    cssresources: [{
      id: 'example-styles',
      picked: true,
      code: `
<style>
  .demo {
    margin: 32px 0 16px 0;
  }
</style>
      `
    }]
  }).

  add('Inline select with a filter', () => {
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
    cssresources: [{
      id: 'example-styles',
      picked: true,
      code: `
<style>
  .demo {
    margin: 16px 0;
  }
</style>
      `
    }]
  }).

  add('Inline select (opens to left)', () => {
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
    cssresources: [{
      id: 'example-styles-open-left',
      picked: true,
      code: `
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
    }]
  }).

  add('Select with disabled move overflow', () => {
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
    cssresources: [{
      id: 'example-styles-disable-move-over',
      picked: true,
      code: `
<style>
  .demo-container {
    padding: 8px;
    width: 50%;
  }

  .demo {
    margin: 16px 0;
  }
</style>
      `
    }]
  });



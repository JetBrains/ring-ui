import 'babel-polyfill';
import DashboardAddons from 'hub-dashboard-addons';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import Select from 'ring-ui/components/select/select';
import Panel from 'ring-ui/components/panel/panel';
import Button from 'ring-ui/components/button/button';

import 'file-loader?name=[name].[ext]!../../manifest.json'; // eslint-disable-line import/no-unresolved
import styles from './app.css';

const COLOR_OPTIONS = [
  {key: 'black', label: 'Black'},
  {key: 'red', label: 'Red'},
  {key: 'blue', label: 'Blue'}
];

class Widget extends Component {
  static propTypes = {
    dashboardApi: PropTypes.object,
    registerWidgetApi: PropTypes.func
  };

  constructor(props) {
    super(props);
    const {registerWidgetApi, dashboardApi} = props;

    this.state = {
      isConfiguring: false,
      selectedColor: COLOR_OPTIONS[0]
    };

    registerWidgetApi({
      onConfigure: () => this.setState({isConfiguring: true})
    });

    this.initialize(dashboardApi);
  }

  initialize(dashboardApi) {
    dashboardApi.readConfig().then(config => {
      if (!config) {
        return;
      }
      this.setState({selectedColor: config.selectedColor});
    });
  }

  saveConfig = async () => {
    const {selectedColor} = this.state;
    await this.props.dashboardApi.storeConfig({selectedColor});
    this.setState({isConfiguring: false});
  };

  cancelConfig = async () => {
    this.setState({isConfiguring: false});
    await this.props.dashboardApi.exitConfigMode();
    this.initialize();
  };

  changeColor = selectedColor => this.setState({selectedColor});

  renderConfiguration() {
    const {selectedColor} = this.state;

    return (
      <div className={styles.widget}>
        <Select
          data={COLOR_OPTIONS}
          selected={selectedColor}
          onChange={this.changeColor}
          label="Select text color"
        />
        <Panel>
          <Button blue={true} onClick={this.saveConfig}>{'Save'}</Button>
          <Button onClick={this.cancelConfig}>{'Cancel'}</Button>
        </Panel>
      </div>
    );
  }

  render() {
    const {selectedColor, isConfiguring} = this.state;

    if (isConfiguring) {
      return this.renderConfiguration();
    }

    return (
      <div className={styles.widget}>
        <h1 style={{color: selectedColor.key}}>{'Hello world'}</h1>
        <p>{'Select "Edit..." option in widget dropdown to configure text color'}</p>
      </div>
    );
  }
}

DashboardAddons.registerWidget((dashboardApi, registerWidgetApi) =>
  render(
    <Widget
      dashboardApi={dashboardApi}
      registerWidgetApi={registerWidgetApi}
    />,
    document.getElementById('app-container')
  )
);

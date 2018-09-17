import DashboardAddons from 'hub-dashboard-addons';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import Select from '@jetbrains/ring-ui/components/select/select';
import Panel from '@jetbrains/ring-ui/components/panel/panel';
import Button from '@jetbrains/ring-ui/components/button/button';
import EmptyWidget, {EmptyWidgetFaces} from '@jetbrains/hub-widget-ui/dist/empty-widget';

import 'file-loader?name=[name].[ext]!../../manifest.json'; // eslint-disable-line import/no-unresolved
import styles from './app.css';
import sayHello from './say-hello';

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
      selectedColor: null
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
    this.initialize(this.props.dashboardApi);
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
          <Button primary onClick={this.saveConfig}>{'Save'}</Button>
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
        {selectedColor
          ? <h1 style={{color: selectedColor.key}}>{sayHello()}</h1>
          : (
            <EmptyWidget
              face={EmptyWidgetFaces.JOY}
              message={'Select "Edit..." option in widget dropdown to configure text color'}
            />
          )}
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

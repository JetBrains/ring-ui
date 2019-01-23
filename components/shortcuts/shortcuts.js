import {Component} from 'react';
import PropTypes from 'prop-types';

import shortcuts from '../shortcuts/core';

// eslint-disable-next-line react/no-deprecated
export default class Shortcuts extends Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    options: PropTypes.object,
    disabled: PropTypes.bool,
    children: PropTypes.node
  };

  static defaultProps = {
    options: {}
  };

  componentWillMount() {
    if (!this.props.disabled) {
      this.turnShorcutsOn();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {disabled} = this.props;
    if (!disabled && nextProps.disabled) {
      this.turnShorcutsOff();
    }
    if (disabled && !nextProps.disabled) {
      this.turnShorcutsOn();
    }
  }

  componentWillUnmount() {
    if (!this.props.disabled) {
      this.turnShorcutsOff();
    }
  }

  turnShorcutsOn() {
    const {map, scope, options} = this.props;
    shortcuts.bindMap(map, this.props);
    shortcuts.pushScope(scope, options);
  }

  turnShorcutsOff() {
    const {scope} = this.props;
    shortcuts.unbindScope(scope);
    shortcuts.spliceScope(scope);
  }

  render() {
    return this.props.children || null;
  }
}

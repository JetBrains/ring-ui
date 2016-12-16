import {Component, PropTypes} from 'react';
import shortcuts from '../shortcuts/core';

export default class Shortcuts extends Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    scope: PropTypes.string.isRequired,
    options: PropTypes.object
  }

  static defaultProps = {
    options: {}
  }

  render() {
    return null;
  }

  componentWillMount() {
    const {map, scope, options} = this.props;
    shortcuts.bindMap(map, this.props);
    shortcuts.pushScope(scope, options);
  }

  /*componentWillReceiveProps(nextProps) {
    this.toggleShortcuts(nextProps);
  }*/

  componentWillUnmount() {
    const {scope} = this.props;
    shortcuts.unbindScope(scope);
    shortcuts.spliceScope(scope);
  }
}

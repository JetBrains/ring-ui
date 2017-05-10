import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';

export default function focusSensorHOC(ComposedComponent) {
  return class FocusSensor extends Component {
    static propTypes = {
      ...ComposedComponent.propTypes,
      focused: PropTypes.bool,
      autofocus: PropTypes.bool,
      onFocus: PropTypes.func,
      onBlur: PropTypes.func
    }

    static defaultProps = {
      ...ComposedComponent.defaultProps,
      focused: false,
      autofocus: false,
      onFocus: () => {},
      onBlur: () => {}
    }

    state = {
      focused: this.props.focused
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          ref={this.onRefUpdate}
          focused={this.state.focused}
          onFocusReset={this.onFocusReset}
          onFocusRestore={this.onFocusRestore}
        />
      );
    }

    onRefUpdate = component => {
      this.node = findDOMNode(component);
    }

    componentDidMount() {
      const {props: {autofocus}, node} = this;

      node.setAttribute('tabindex', '0');
      node.style.outline = 'none';

      document.addEventListener('focus', this.onFocusCapture, true);
      document.addEventListener('blur', this.onBlurCapture, true);

      if (autofocus) {
        node.focus();
      }
    }

    componentWillUnmount() {
      document.removeEventListener('focus', this.onFocusCapture, true);
      document.removeEventListener('blur', this.onBlurCapture, true);
    }

    componentDidUpdate(prevProps) {
      const {focused} = this.props;
      if (focused && !prevProps.focused) {
        this.onFocusRestore();
      } else if (!focused && prevProps.focused) {
        this.onFocusReset();
      }
    }

    onFocusCapture = ({target}) => {
      const focused = this.node.contains(target);
      if (focused && !this.state.focused) {
        this.setState({focused: true});
        this.props.onFocus();
      }
    }

    onBlurCapture = ({target}) => {
      const {state: {focused}, node} = this;
      if (focused) {
        setTimeout(() => {
          const blured = node.contains(target) && !node.contains(document.activeElement);
          if (blured) {
            this.setState({focused: false});
            this.props.onBlur();
          }
        }, 1);
      }
    }

    onFocusRestore = () => {
      this.node.focus();
    }

    onFocusReset = () => {
      this.node.blur();
    }
  };
}

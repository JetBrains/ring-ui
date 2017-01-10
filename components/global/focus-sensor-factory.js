import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';

/* eslint-disable react/jsx-max-props-per-line */

export default function focusSensorFactory(ComposedComponent) {
  return class FocusSensor extends Component {
    static propTypes = {
      autofocus: PropTypes.bool
    }

    static defaultProps = {
      autofocus: false
    }

    state = {
      focused: false
    }

    render() {
      return (
        <div ref={this.onRefUpdate} tabIndex="0" style={{outline: 'none'}}>
          <ComposedComponent
            {...this.props}
            focused={this.state.focused}
            onFocusRestore={this.onFocusRestore}
          />
        </div>
      );
    }

    onRefUpdate = component => {
      this.node = findDOMNode(component);
    }

    componentDidMount() {
      document.addEventListener('focus', this.onFocusCapture, true);
      document.addEventListener('blur', this.onBlurCapture, true);

      const {props: {autofocus}, node} = this;
      if (autofocus) {
        node.focus();
      }
    }

    componentWillUnmount() {
      document.removeEventListener('focus', this.onFocusCapture, true);
      document.removeEventListener('blur', this.onBlurCapture, true);
    }

    onFocusCapture = ({target}) => {
      const focused = this.node.contains(target);
      if (focused && !this.state.focused) {
        this.setState({focused: true});
      }
    }

    onBlurCapture = ({target}) => {
      const {state: {focused}, node} = this;
      if (focused) {
        setTimeout(() => {
          const blured = node.contains(target) && !node.contains(document.activeElement);
          if (blured) {
            this.setState({focused: false});
          }
        }, 1);
      }
    }

    onFocusRestore = () => {
      this.node.focus();
    }
  };
}

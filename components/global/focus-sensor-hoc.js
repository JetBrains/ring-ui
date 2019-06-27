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
    };

    static defaultProps = {
      ...ComposedComponent.defaultProps,
      focused: false,
      autofocus: false,
      onFocus: () => {},
      onBlur: () => {}
    };

    state = {
      focused: this.props.focused
    };

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

    componentDidUpdate(prevProps) {
      const {focused} = this.props;
      if (focused && !prevProps.focused) {
        this.onFocusRestore();
      } else if (!focused && prevProps.focused) {
        this.onFocusReset();
      }
    }

    componentWillUnmount() {
      document.removeEventListener('focus', this.onFocusCapture, true);
      document.removeEventListener('blur', this.onBlurCapture, true);
    }

    _skipNextCapture = false;

    onRefUpdate = component => {
      // eslint-disable-next-line react/no-find-dom-node
      this.node = findDOMNode(component);
    };

    onFocusCapture = ({target}) => {
      if (this._skipNextCapture) {
        this._skipNextCapture = false;
        return;
      }
      const focused = this.node.contains(target);
      if (focused && !this.state.focused) {
        this.setState({focused: true});
        this.props.onFocus();
      }
    };

    onBlurCapture = ({target}) => {
      const {state: {focused}, node} = this;
      if (focused) {
        setTimeout(() => {
          const blurred = node.contains(target) && !node.contains(document.activeElement);
          if (blurred) {
            this.setState({focused: false});
            this.props.onBlur();
          }
        }, 1);
      }
    };

    onFocusRestore = () => {
      this._skipNextCapture = true;
      this.node.focus();
    };

    onFocusReset = () => {
      this.node.blur();
    };

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
  };
}

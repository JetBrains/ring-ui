import React, {Component, ComponentType, Ref} from 'react';
import PropTypes from 'prop-types';

import composeRefs from './composeRefs';

import {refObject} from '@jetbrains/ring-ui/components/global/prop-types';

export interface FocusSensorProps<T extends HTMLElement> {
  focused?: boolean | undefined
  autofocus?: boolean | undefined
  onFocus?: (() => void) | undefined
  onBlur?: (() => void) | undefined
  innerRef?: Ref<T> | null | undefined
}

export interface FocusSensorAddProps<T extends HTMLElement> {
  innerRef: Ref<T>
  focused: boolean
  onFocusReset: () => void
  onFocusRestore: () => void
}

function extractPropTypes<
  T extends HTMLElement,
  P extends FocusSensorAddProps<T>
>({propTypes}: ComponentType<P>) {
  if (propTypes == null) {
    return propTypes;
  }
  const {innerRef, focused, onFocusReset, onFocusRestore, ...restPropTypes} = propTypes;
  return restPropTypes;
}

type RestProps<P, T extends HTMLElement> = Omit<P, keyof FocusSensorAddProps<T>>
type Props<P, T extends HTMLElement> = RestProps<P, T> & FocusSensorProps<T>

export default function focusSensorHOC<
  T extends HTMLElement,
  P extends FocusSensorAddProps<T>,
>(ComposedComponent: ComponentType<P>): ComponentType<Props<P, T>> {
  class FocusSensor extends Component<Props<P, T>> {
    state = {
      focused: this.props.focused
    };

    componentDidMount() {
      const {props: {autofocus}, node} = this;

      node?.setAttribute('tabindex', '0');
      if (node != null) {
        node.style.outline = 'none';
      }

      document.addEventListener('focus', this.onFocusCapture, true);
      document.addEventListener('blur', this.onBlurCapture, true);

      if (autofocus) {
        node?.focus();
      }
    }

    componentDidUpdate(prevProps: Props<P, T>) {
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

    node?: HTMLElement | null;
    private _skipNextCapture = false;

    onRefUpdate = (node: HTMLElement | null) => {
      if (node) {
        this.node = node;
      }
    };

    onFocusCapture = ({target}: FocusEvent) => {
      if (this._skipNextCapture) {
        this._skipNextCapture = false;
        return;
      }
      const focused = target instanceof Node && this.node?.contains(target);
      if (focused && !this.state.focused) {
        this.setState({focused: true});
        this.props.onFocus?.();
      }
    };

    onBlurCapture = ({target}: FocusEvent) => {
      const {state: {focused}, node} = this;
      if (focused) {
        setTimeout(() => {
          const blurred = target instanceof Node &&
            node?.contains(target) && !node.contains(document.activeElement);
          if (blurred) {
            this.setState({focused: false});
            this.props.onBlur?.();
          }
        }, 1);
      }
    };

    onFocusRestore = () => {
      this._skipNextCapture = true;
      this.node?.focus();
    };

    onFocusReset = () => {
      this.node?.blur();
    };

    render() {
      const {autofocus, focused, onFocus, onBlur, innerRef, ...rest} = this.props;
      return (
        <ComposedComponent
          {...rest as P}
          innerRef={composeRefs(innerRef, this.onRefUpdate)}
          focused={this.state.focused}
          onFocusReset={this.onFocusReset}
          onFocusRestore={this.onFocusRestore}
        />
      );
    }
  }
  (FocusSensor as ComponentType<unknown>).propTypes = {
    ...extractPropTypes(ComposedComponent),
    focused: PropTypes.bool,
    autofocus: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    innerRef: PropTypes.oneOfType([PropTypes.func, refObject(PropTypes.instanceOf(HTMLElement))])
  };
  (FocusSensor as ComponentType<unknown>).defaultProps = {
    ...ComposedComponent.defaultProps,
    focused: false,
    autofocus: false,
    onFocus: () => {},
    onBlur: () => {}
  };
  return FocusSensor;
}

import {Component, ComponentType, Ref} from 'react';

import {createComposedRef} from './composeRefs';

export interface FocusSensorOuterProps<T extends HTMLElement> {
  focused?: boolean | undefined;
  autofocus?: boolean | undefined;
  scrollOnTableFocus?: boolean;
  onFocus?: (() => void) | undefined;
  onBlur?: (() => void) | undefined;
  innerRef?: Ref<T> | null | undefined;
}

export interface FocusSensorAddProps<T extends HTMLElement> {
  innerRef: Ref<T>;
  focused: boolean;
  onFocusReset: () => void;
  onFocusRestore: () => void;
}

type RestProps<P, T extends HTMLElement> = Omit<P, keyof FocusSensorAddProps<T>>;
export type FocusSensorProps<
  P extends FocusSensorAddProps<T>,
  T extends HTMLElement,
  C extends ComponentType<P>,
> = RestProps<JSX.LibraryManagedAttributes<C, P>, T> & FocusSensorOuterProps<T>;

export default function focusSensorHOC<
  T extends HTMLElement,
  P extends FocusSensorAddProps<T>,
  C extends ComponentType<P>,
>(ComposedComponent: C): ComponentType<FocusSensorProps<P, T, typeof ComposedComponent>> {
  class FocusSensor extends Component<FocusSensorProps<P, T, typeof ComposedComponent>> {
    state = {
      focused: this.props.focused,
    };

    componentDidMount() {
      const {
        props: {autofocus, scrollOnTableFocus},
        node,
      } = this;

      node?.setAttribute('tabindex', '0');
      if (node != null) {
        node.style.outline = 'none';
      }

      document.addEventListener('focus', this.onFocusCapture, true);
      document.addEventListener('blur', this.onBlurCapture, true);

      if (autofocus) {
        node?.focus({preventScroll: !scrollOnTableFocus});
      }
    }

    componentDidUpdate(prevProps: FocusSensorProps<P, T, typeof ComposedComponent>) {
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

    composedRef = createComposedRef<HTMLElement>();

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
      const {
        state: {focused},
        node,
      } = this;
      if (focused) {
        setTimeout(() => {
          const blurred = target instanceof Node && node?.contains(target) && !node.contains(document.activeElement);
          if (blurred) {
            this.setState({focused: false});
            this.props.onBlur?.();
          }
        }, 1);
      }
    };

    onFocusRestore = () => {
      this._skipNextCapture = true;
      this.node?.focus({preventScroll: !this.props.scrollOnTableFocus});
    };

    onFocusReset = () => {
      this.node?.blur();
    };

    render() {
      const {autofocus, focused, onFocus, onBlur, innerRef, scrollOnTableFocus, ...rest} = this.props;
      return (
        <ComposedComponent
          {...(rest as JSX.LibraryManagedAttributes<C, P>)}
          innerRef={this.composedRef(innerRef, this.onRefUpdate)}
          focused={this.state.focused}
          onFocusReset={this.onFocusReset}
          onFocusRestore={this.onFocusRestore}
        />
      );
    }
  }
  (FocusSensor as ComponentType<unknown>).defaultProps = {
    ...ComposedComponent.defaultProps,
    focused: false,
    autofocus: false,
    scrollOnTableFocus: true,
    onFocus: () => {},
    onBlur: () => {},
  };
  return FocusSensor;
}

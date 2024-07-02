import {Component, forwardRef, Ref, ForwardedRef} from 'react';

import {createComposedRef} from './composeRefs';

export interface RerenderableComponent<P, S> extends Component<P, S> {
  node?: HTMLElement | null
}

export interface RerenderableComponentClass<P, S> {
  new (props: P): RerenderableComponent<P, S>;
}

/**
 * Wraps a component to add a "rerender" method
 * @param ComposedComponent
 * @param captureNode, whether the wrapper should capture this.node itself. Set to false if the component already has "node" property captured
 * @returns {Rerenderer}
 */


type RerendererProps<P, C> ={props: P, forwardedRef: Ref<C>};

export default function rerenderHOC<P extends {}, C extends Component<P, unknown>>(
  ComposedComponent: { new (props: P): C }
) {
  class Rerenderer extends Component<RerendererProps<P, C>, P> {
    state = this.props.props;

    composedRef = createComposedRef<C>();

    render() {
      const ref = this.composedRef(this.props.forwardedRef);
      return (
        <ComposedComponent
          {...this.state}
          ref={instance =>
            ref(instance != null ? {...instance, rerender: this.setState.bind(this)} : null)}
        />
      );
    }
  }

  return forwardRef(function RerendererForwardRef(props: P, ref: ForwardedRef<C>) {
    return <Rerenderer props={props} forwardedRef={ref}/>;
  });
}

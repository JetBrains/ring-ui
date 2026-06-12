import {Component, type Ref, type PropsWithoutRef} from 'react';

import {createComposedRef} from './compose-refs';

export interface RerenderableComponent<P, S> extends Component<P, S> {
  node?: HTMLElement | null;
}

export interface RerenderableComponentClass<P, S> {
  new (props: P): RerenderableComponent<P, S>;
}

/**
 * Wraps a component to add a "rerender" method
 * @param ComposedComponent
 * @param captureNode, whether the wrapper should capture this.node itself. Set to false if the component already has "node" property captured
 * @mockReturnValue {Rerenderer}
 */

interface RerendererProps<P, C> {
  props: P;
  forwardedRef: Ref<C>;
}

export default function rerenderHOC<P extends {}, C extends Component<P, unknown>>(ComposedComponent: {
  new (props: P): C;
}) {
  class Rerenderer extends Component<RerendererProps<P, C>, P> {
    state = this.props.props;

    composedRef = createComposedRef<C>();

    render() {
      const ref = this.composedRef(this.props.forwardedRef);
      return (
        <ComposedComponent
          {...this.state}
          ref={instance => ref(instance ? {...instance, rerender: this.setState.bind(this)} : null)}
        />
      );
    }
  }

  return function RerendererForwardRef({ref, ...props}: PropsWithoutRef<P> & {ref: React.Ref<C>}) {
    return <Rerenderer props={props as unknown as P} forwardedRef={ref} />;
  };
}

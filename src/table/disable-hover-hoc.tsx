import {PureComponent, ComponentType} from 'react';

export interface DisableHoverAddProps {
  disabledHover: boolean
}

export type DisableHoverProps<P extends DisableHoverAddProps> = Omit<P, keyof DisableHoverAddProps>

export default function disableHoverHOC<P extends DisableHoverAddProps>(
  ComposedComponent: ComponentType<P>
) {
  return class DisableHover extends PureComponent<DisableHoverProps<P>> {
    static propTypes = ComposedComponent.propTypes;
    static defaultProps = ComposedComponent.defaultProps;

    state = {
      disabledHover: false
    };

    componentDidMount() {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('keydown', this.onKeyDown, true);
    }

    componentWillUnmount() {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('keydown', this.onKeyDown, true);
    }

    onMouseMove = () => {
      if (this.state.disabledHover) {
        this.setState({disabledHover: false});
      }
    };

    onKeyDown = (e: KeyboardEvent) => {
      const metaKeys = [16, 17, 18, 19, 20, 91]; // eslint-disable-line @typescript-eslint/no-magic-numbers
      if (!this.state.disabledHover && !metaKeys.includes(e.keyCode)) {
        this.setState({disabledHover: true});
      }
    };

    render() {
      return (
        <ComposedComponent
          {...this.props as P}
          disabledHover={this.state.disabledHover}
        />
      );
    }
  };
}

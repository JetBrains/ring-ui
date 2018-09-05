import React, {PureComponent} from 'react';

export default function disableHoverHOC(ComposedComponent) {
  return class DisableHover extends PureComponent {
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

    onKeyDown = e => {
      const metaKeys = [16, 17, 18, 19, 20, 91]; // eslint-disable-line no-magic-numbers
      if (!this.state.disabledHover && !metaKeys.includes(e.keyCode)) {
        this.setState({disabledHover: true});
      }
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          disabledHover={this.state.disabledHover}
        />
      );
    }
  };
}

import {Component} from 'react';
import PropTypes from 'prop-types';

export interface RendererProps {
  className?: string | undefined
  nodes: readonly Node[] | NodeList;
}

export default class Renderer extends Component<RendererProps> {
  static propTypes = {
    className: PropTypes.string,
    nodes: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
  };

  componentDidMount() {
    const {node} = this;
    const {nodes} = this.props;
    if (!node || !nodes || !nodes.length) {
      return;
    }
    Array.from(this.props.nodes).
      forEach(nodeToRender => node.appendChild(nodeToRender));
  }

  node?: HTMLElement | null;
  nodeRef = (node: HTMLElement | null) => {
    this.node = node;
  };

  render() {
    const {className} = this.props;
    return (
      <div
        className={className}
        ref={this.nodeRef}
      />
    );
  }
}

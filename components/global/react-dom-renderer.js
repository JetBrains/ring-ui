import React, {PropTypes, Component} from 'react';

export default class Renderer extends Component {
  static propTypes = {
    className: PropTypes.string,
    nodes: PropTypes.array
  };

  componentDidMount() {
    const {nodes} = this.props;
    if (!this.node || !nodes || !nodes.length) {
      return;
    }
    const fragment = document.createDocumentFragment();
    nodes.forEach(nodeToRender => fragment.appendChild(nodeToRender));

    this.node.appendChild(fragment);
  }

  render() {
    const {className} = this.props;
    return (
      <div
        className={className}
        ref={node => {
          this.node = node;
        }}
      />
    );
  }
}

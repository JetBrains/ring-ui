import React, {PropTypes, Component} from 'react';

export default class Renderer extends Component {
  static propTypes = {
    nodes: PropTypes.array
  };

  componentDidMount() {
    const {nodes} = this.props;
    if (!this.node || !nodes || !nodes.length) {
      return;
    }
    const fragment = document.createDocumentFragment();
    nodes.forEach(nodeToRender => fragment.appendChild(nodeToRender));

    this.node.parentNode.replaceChild(fragment, this.node);
  }

  render() {
    return (
      <span ref={node => {
        this.node = node;
      }}
      />
    );
  }
}

import React, {Component} from 'react';
import PropTypes from 'prop-types';

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

  nodeRef = node => {
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

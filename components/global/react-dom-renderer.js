import React, {PropTypes, Component} from 'react';
import {findDOMNode} from 'react-dom';

export default class Renderer extends Component {
  static propTypes = {
    nodes: PropTypes.array
  };

  componentDidMount() {
    const {nodes} = this.props;
    if (!nodes) {
      return;
    }
    const componentNode = findDOMNode(this);

    const fragment = document.createDocumentFragment();
    [].concat(nodes).forEach(nodeToRender => fragment.appendChild(nodeToRender));

    componentNode.parentNode.replaceChild(fragment, componentNode);
  }

  render() {
    return <span/>;
  }
}

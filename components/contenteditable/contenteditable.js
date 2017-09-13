/**
 * @name ContentEditable
 * @category Components
 * @description Provides a ContentEditable component.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';

function noop() {}

/**
 * @name ContentEditable
 * @constructor
 * @extends {ReactComponent}
 * @example
   <example name="ContentEditable">
     <file name="index.html">
       <div id='contenteditable'></div>
       <div id='contenteditable-disabled' style="padding-top: 16px;"></div>
     </file>

     <file name="index.js" webpack="true">
       import '@jetbrains/ring-ui/components/input/input.scss';
       import {render} from 'react-dom';
       import React from 'react';

       import ContentEditable from '@jetbrains/ring-ui/components/contenteditable/contenteditable';

       render(
         <ContentEditable className="ring-input">
           <span>text <b>bold text</b> text</span>
         </ContentEditable>,
         document.getElementById('contenteditable')
       );

       render(
         <ContentEditable className="ring-input" disabled={true}>
           <span>text <b>bold text</b> text</span>
         </ContentEditable>,
         document.getElementById('contenteditable-disabled')
       );
     </file>
   </example>
 */
export default class ContentEditable extends Component {
  /** @override */
  static propTypes = {
    disabled: PropTypes.bool,
    componentDidUpdate: PropTypes.func,
    onComponentUpdate: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node
  };

  static defaultProps = {
    disabled: false,
    tabIndex: 0,
    onInput: noop,
    onComponentUpdate: noop
  };

  state = {};

  componentWillMount() {
    this.renderStatic(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.renderStatic(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.disabled !== this.props.disabled ||
      nextState.__html !== this.state.__html;
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.onComponentUpdate(prevProps, prevState);
  }

  renderStatic(nextProps) {
    if (!nextProps.children) {
      this.setState({__html: ''});
    }

    const onRender = node => {
      this.setState({__html: node ? node.innerHTML : ''});
    };

    render(<i ref={onRender}>{nextProps.children}</i>, document.createElement('i'));
  }

  render() {
    const {children, onComponentUpdate, ...props} = this.props; // eslint-disable-line no-unused-vars

    return (
      <div
        {...props}
        contentEditable={!this.props.disabled}
        dangerouslySetInnerHTML={this.state}
      />
    );
  }
}

/**
 * @name ContentEditable
 * @category Forms
 * @description Provides a ContentEditable component.
 */

import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';

import RingComponent from '../ring-component/ring-component';

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
       import 'ring-ui/components/input/input.scss';
       import {render} from 'react-dom';
       import React from 'react';

       import ContentEditable from 'ring-ui/components/contenteditable/contenteditable';

       render(ContentEditable.factory({className: 'ring-input'},
         <span>text <b>bold text</b> text</span>
       ), document.getElementById('contenteditable'));

       render(ContentEditable.factory({className: 'ring-input', disabled: true},
         <span>text <b>bold text</b> text</span>
       ), document.getElementById('contenteditable-disabled'));
     </file>
   </example>
 */
export default class ContentEditable extends RingComponent {
  /** @override */
  static propTypes = {
    disabled: PropTypes.bool,
    componentDidUpdate: PropTypes.func
  };

  static defaultProps = {
    disabled: false,
    tabIndex: 0,
    onInput: noop,
    onComponentUpdate: noop
  };

  state = {};

  didUpdate(prevProps, prevState) {
    this.props.onComponentUpdate(prevProps, prevState);
  }

  willMount() {
    this.renderStatic(this.props);
  }

  willReceiveProps(nextProps) {
    this.renderStatic(nextProps);
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

  shouldUpdate(nextProps, nextState) {
    return nextProps.disabled !== this.props.disabled ||
      nextState.__html !== this.state.__html;
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

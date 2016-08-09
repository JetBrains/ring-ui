/**
 * @name ContentEditable
 * @fileoverview ContentEditable component
 */

import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
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
       require('ring-ui/components/input/input.scss');
       var render = require('react-dom').render;
       var React = require('react');

       var ContentEditable = require('ring-ui/components/contenteditable/contenteditable');

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
    disabled: React.PropTypes.bool,
    componentDidUpdate: React.PropTypes.func
  };

  // Use for IE11 and down to 9
  static impotentIE = document.documentMode <= 11;  // TODO Proper browser detection?
  static mutationEvent = 'DOMSubtreeModified';

  static defaultProps = {
    disabled: false,
    tabIndex: 0,
    onInput: noop,
    onComponentUpdate: noop
  };

  state = {};

  didMount() {
    if (ContentEditable.impotentIE) {
      this.triggerInput = (...args) => this.props.onInput(...args);

      this.node.addEventListener(ContentEditable.mutationEvent, this.triggerInput);
    }
  }

  didUpdate(prevProps, prevState) {
    this.props.onComponentUpdate(prevProps, prevState);
  }

  willMount() {
    this.renderStatic(this.props);
  }

  willReceiveProps(nextProps) {
    this.renderStatic(nextProps);
  }

  willUnmount() {
    if (ContentEditable.impotentIE) {
      this.node.removeEventListener(ContentEditable.mutationEvent, this.triggerInput);
    }
  }

  renderStatic(nextProps) {
    const __html = nextProps.children ? renderToStaticMarkup(nextProps.children) : '';
    this.setState({__html});
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

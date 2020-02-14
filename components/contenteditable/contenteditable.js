import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {renderToStaticMarkup} from 'react-dom/server';

/**
 * @name ContentEditable
 */

function noop() {}

export default class ContentEditable extends Component {
  /** @override */
  static propTypes = {
    disabled: PropTypes.bool,
    tabIndex: PropTypes.number,
    componentDidUpdate: PropTypes.func,
    onComponentUpdate: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node,
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
  };

  static defaultProps = {
    disabled: false,
    tabIndex: 0,
    onInput: noop,
    onComponentUpdate: noop
  };

  static getDerivedStateFromProps = ({children}) => ({
    __html: children ? renderToStaticMarkup(children) : ''
  });

  state = {__html: ''};

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.disabled !== this.props.disabled ||
      nextState.__html !== this.state.__html;
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.onComponentUpdate(prevProps, prevState);
  }

  render() {
    const {children, onComponentUpdate, disabled, tabIndex, inputRef, ...props} = this.props;

    return (
      <div
        {...props}
        ref={inputRef}
        disabled={disabled}
        role="textbox"
        tabIndex={disabled ? null : tabIndex}
        contentEditable={!this.props.disabled}
        dangerouslySetInnerHTML={this.state}
      />
    );
  }
}

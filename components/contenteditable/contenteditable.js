import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {renderToStaticMarkup} from 'react-dom/server';

/**
 * @name ContentEditable
 */

function noop() {}

const commonPropTypes = {
  disabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  componentDidUpdate: PropTypes.func,
  onComponentUpdate: PropTypes.func,
  className: PropTypes.string,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

class ContentEditableBase extends Component {
  static propTypes = {
    ...commonPropTypes,
    __html: PropTypes.string
  };

  static defaultProps = {
    disabled: false,
    tabIndex: 0,
    onInput: noop,
    onComponentUpdate: noop
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.disabled !== this.props.disabled ||
      nextProps.__html !== this.props.__html;
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.onComponentUpdate(prevProps, prevState);
  }

  render() {
    const {__html, onComponentUpdate, disabled, tabIndex, inputRef, ...props} = this.props;

    return (
      <div
        {...props}
        ref={inputRef}
        disabled={disabled}
        role="textbox"
        tabIndex={disabled ? null : tabIndex}
        contentEditable={!this.props.disabled}
        dangerouslySetInnerHTML={{__html}}
      />
    );
  }
}

const ContentEditable = ({children, ...props}) =>
  <ContentEditableBase {...props} __html={renderToStaticMarkup(children)}/>;
ContentEditable.propTypes = {
  ...commonPropTypes,
  children: PropTypes.node
};

export default ContentEditable;

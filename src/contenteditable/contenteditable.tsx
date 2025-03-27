import {Component, HTMLAttributes, Ref, ReactElement} from 'react';
import PropTypes from 'prop-types';
import {renderToStaticMarkup} from 'react-dom/server';

/**
 * @name ContentEditable
 */

function noop() {}

export interface ContentEditableBaseProps extends HTMLAttributes<HTMLElement> {
  disabled: boolean
  onComponentUpdate: ((prevProps: ContentEditableBaseProps) => void)
  inputRef?: Ref<HTMLDivElement> | null | undefined
  __html: string
}

const commonPropTypes = {
  disabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  componentDidUpdate: PropTypes.func,
  onComponentUpdate: PropTypes.func,
  className: PropTypes.string,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

class ContentEditableBase extends Component<ContentEditableBaseProps> {
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

  shouldComponentUpdate(nextProps: ContentEditableBaseProps) {
    return nextProps.disabled !== this.props.disabled ||
      nextProps.__html !== this.props.__html;
  }

  componentDidUpdate(prevProps: ContentEditableBaseProps) {
    this.props.onComponentUpdate(prevProps);
  }

  render() {
    const {__html, onComponentUpdate, disabled, tabIndex, inputRef, ...props} = this.props;

    return (
      <div
        {...props}
        ref={inputRef}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        disabled={disabled}
        role="textbox"
        tabIndex={disabled ? undefined : tabIndex}
        contentEditable={!this.props.disabled}
        dangerouslySetInnerHTML={{__html}}
      />
    );
  }
}

type ContentEditableBaseAttrs =
  React.JSX.LibraryManagedAttributes<
  typeof ContentEditableBase,
  ContentEditableBaseProps
>

export type ContentEditableProps = Omit<ContentEditableBaseAttrs, '__html'>

const ContentEditable = ({children, ...props}: ContentEditableProps) =>
  <ContentEditableBase {...props} __html={renderToStaticMarkup(children as ReactElement)}/>;
ContentEditable.propTypes = {
  ...commonPropTypes,
  children: PropTypes.node
};

export default ContentEditable;

import {Component, type HTMLAttributes, type Ref, type ReactElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

/**
 * @name ContentEditable
 */

function noop() {}

export interface ContentEditableBaseProps extends HTMLAttributes<HTMLElement> {
  disabled: boolean;
  onComponentUpdate: (prevProps: ContentEditableBaseProps) => void;
  inputRef?: Ref<HTMLDivElement> | null | undefined;
  __html: string;
}

class ContentEditableBase extends Component<ContentEditableBaseProps> {
  static defaultProps = {
    disabled: false,
    tabIndex: 0,
    onInput: noop,
    onComponentUpdate: noop,
  };

  shouldComponentUpdate(nextProps: ContentEditableBaseProps) {
    // eslint-disable-next-line no-underscore-dangle
    return nextProps.disabled !== this.props.disabled || nextProps.__html !== this.props.__html;
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
        role='textbox'
        tabIndex={disabled ? undefined : tabIndex}
        contentEditable={!this.props.disabled}
        dangerouslySetInnerHTML={{__html}}
      />
    );
  }
}

type ContentEditableBaseAttrs = React.JSX.LibraryManagedAttributes<
  typeof ContentEditableBase,
  ContentEditableBaseProps
>;

export type ContentEditableProps = Omit<ContentEditableBaseAttrs, '__html'>;

const ContentEditable = ({children, ...props}: ContentEditableProps) => (
  <ContentEditableBase {...props} __html={renderToStaticMarkup(children as ReactElement)} />
);

export default ContentEditable;

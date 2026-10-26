import {Component, type HTMLAttributes, type Ref} from 'react';
import {createPortal} from 'react-dom';

import {createComposedRef} from '../global/compose-refs';

/**
 * @name ContentEditable
 */

function noop() {}

export interface ContentEditableBaseProps extends HTMLAttributes<HTMLElement> {
  disabled: boolean;
  onComponentUpdate: (prevProps: ContentEditableBaseProps) => void;
  inputRef?: Ref<HTMLDivElement> | null | undefined;
  /**
   * @deprecated Not used anymore, kept only for `onComponentUpdate` prevProps compatibility.
   * TODO: Remove in 8.0
   */
  __html: string;
}

class ContentEditableBase extends Component<Omit<ContentEditableBaseProps, '__html'>> {
  static defaultProps = {
    disabled: false,
    tabIndex: 0,
    onInput: noop,
    onComponentUpdate: noop,
  };

  componentDidMount() {
    this.syncContent();
  }

  componentDidUpdate(prevProps: ContentEditableBaseProps) {
    const prevHtml = this.html ?? '';
    const contentChanged = this.syncContent();
    if (contentChanged || prevProps.disabled !== this.props.disabled) {
      this.props.onComponentUpdate({...prevProps, __html: prevHtml});
    }
  }

  // Children are rendered here and cloned into the editable node, so React never reconciles user-edited DOM
  container = document.createElement('div');
  node: HTMLDivElement | null = null;
  html: string | null = null;

  nodeRef = (node: HTMLDivElement | null) => {
    this.node = node;
  };

  composedRef = createComposedRef<HTMLDivElement>();

  syncContent() {
    const html = this.container.innerHTML;
    if (html === this.html) {
      return false;
    }
    this.html = html;
    this.node?.replaceChildren(...Array.from(this.container.childNodes, child => child.cloneNode(true)));
    return true;
  }

  render() {
    const {children, onComponentUpdate, disabled, tabIndex, inputRef, ...props} = this.props;

    return (
      <>
        <div
          {...props}
          ref={this.composedRef(this.nodeRef, inputRef ?? undefined)}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          disabled={disabled}
          role='textbox'
          tabIndex={disabled ? undefined : tabIndex}
          contentEditable={!this.props.disabled}
        />
        {createPortal(children, this.container)}
      </>
    );
  }
}

type ContentEditableBaseAttrs = React.JSX.LibraryManagedAttributes<
  typeof ContentEditableBase,
  ContentEditableBaseProps
>;

export type ContentEditableProps = Omit<ContentEditableBaseAttrs, '__html'>;

const ContentEditable = (props: ContentEditableProps) => <ContentEditableBase {...props} />;

export default ContentEditable;

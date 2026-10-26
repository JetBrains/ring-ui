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
    const contentChanged = this.syncContent();
    if (contentChanged || prevProps.disabled !== this.props.disabled) {
      this.props.onComponentUpdate(prevProps);
    }
  }

  // React renders children here (off-document), then the result is cloned into the editable node.
  // The editable node has no React-managed children, so user edits can't break reconciliation.
  // ponytail: document access at render time, not SSR-safe (portals aren't either)
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

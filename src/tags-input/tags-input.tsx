/* eslint-disable max-lines */
import {PureComponent, type SyntheticEvent, type ReactNode, type ComponentType} from 'react';
import * as React from 'react';
import classNames from 'classnames';

import getEventKey from '../global/get-event-key';
import Select, {type SelectItem} from '../select/select';
import TagsList, {type TagType} from '../tags-list/tags-list';
import Caret from '../caret/caret';
import memoize from '../global/memoize';
import rerenderHOC from '../global/rerender-hoc';
import {Size} from '../input/input';
import {type ControlsHeight, ControlsHeightContext} from '../global/controls-height';
import {type Filter} from '../select/select-popup';
import getUID from '../global/get-uid';
import inputStyles from '../input/input.css';
import {type TagAttrs} from '../tag/tag';
import ControlLabel, {type LabelType} from '../control-label/control-label';
import styles from './tags-input.css';

function noop() {}

/**
 * @name Tags Input
 */

const POPUP_VERTICAL_SHIFT = 2;

export interface ToggleTagParams {
  tag: TagType;
}

export interface TagsInputRequestParams {
  query: string;
}

export interface TagsInputProps {
  /**
   * Datasource should return array(or promise) of suggestions.
   * Each suggestion should contain key and label fields.
   * DataSource should handle caching and response racing (when later request
   * responded earlier) by himself.
   */
  dataSource: (params: TagsInputRequestParams) => readonly SelectItem[] | Promise<readonly SelectItem[]>;
  onAddTag: (params: ToggleTagParams) => void;
  onRemoveTag: (params: ToggleTagParams) => void;
  customTagComponent: ComponentType<TagAttrs>;
  maxPopupHeight: number;
  minPopupWidth: number;
  canNotBeEmpty: boolean;
  disabled: boolean;
  autoOpen: boolean;
  renderOptimization: boolean;
  allowAddNewTags: boolean;
  filter: boolean | Filter;
  placeholder: string;
  className?: string | null | undefined;
  tags?: readonly TagType[] | null | undefined;
  loadingMessage?: string | undefined;
  notFoundMessage?: string | undefined;
  hint?: ReactNode | null | undefined;
  size: Size;
  height?: ControlsHeight | undefined;
  label?: ReactNode;
  labelType?: LabelType;
  id?: string | undefined;
}

interface TagsInputState {
  tags: TagType[];
  prevTags: TagType[] | null;
  suggestions: SelectItem[];
  loading: boolean;
  focused: boolean;
  query: string;
  activeIndex: number | null | undefined;
}

export default class TagsInput extends PureComponent<TagsInputProps, TagsInputState> {
  static defaultProps = {
    dataSource: noop,
    onAddTag: noop,
    onRemoveTag: noop,
    customTagComponent: null,
    maxPopupHeight: 500,
    minPopupWidth: 360,
    canNotBeEmpty: false,
    disabled: false,
    autoOpen: false,
    renderOptimization: true,
    allowAddNewTags: false,
    filter: {fn: () => true},
    placeholder: 'Select an option',
    size: Size.M,
  };

  constructor(props: TagsInputProps) {
    super(props);
    this.ngModelStateField = TagsInput.ngModelStateField;
  }

  state: TagsInputState = {
    tags: [],
    prevTags: null,
    suggestions: [],
    loading: true,
    focused: false,
    query: '',
    activeIndex: 0,
  };

  static getDerivedStateFromProps({tags}: TagsInputProps, {prevTags}: TagsInputState) {
    const nextState = {prevTags: tags};
    if (tags && tags !== prevTags) {
      Object.assign(nextState, {tags, activeIndex: tags?.length});
    }
    return nextState;
  }

  componentDidMount() {
    if (this.props.autoOpen && !this.props.disabled) {
      this.focusInput();
      this.loadSuggestions();
      // eslint-disable-next-line no-underscore-dangle
      this.select?._showPopup();
    }
  }

  static ngModelStateField = 'tags';
  ngModelStateField: string;

  static contextType = ControlsHeightContext;
  declare context: React.ContextType<typeof ControlsHeightContext>;

  id = this.props.id || getUID('ring-tags-list-');

  node?: HTMLElement | null;
  nodeRef = (node: HTMLElement | null) => {
    this.node = node;
  };

  input?: HTMLInputElement | null;
  caret?: Caret;
  getInputNode() {
    if (!this.input) {
      this.input = this.select?.filter;
      if (this.input) {
        this.caret = new Caret(this.input);
      }
    }
    return this.input;
  }

  setActiveIndex(activeIndex?: number | null) {
    this.setState({activeIndex});
  }

  focusInput = () => {
    this.getInputNode()?.focus();
  };

  focus = () => {
    this.focusInput();
  };

  addTag = (tag: TagType | null) => {
    if (tag === null) {
      return;
    }
    const isUniqueTag = this.state.tags.filter(item => tag.key === item.key).length === 0;
    this.select?.clear();
    this.select?.filterValue('');

    if (isUniqueTag) {
      this.setState(prevState => ({
        tags: prevState.tags.concat([tag]),
      }));
      this.props.onAddTag({tag});
      this.setActiveIndex();
    }
  };

  onRemoveTag(tagToRemove: TagType) {
    return Promise.resolve(this.props.onRemoveTag({tag: tagToRemove})).then(() => {
      const tags = this.state.tags.filter(tag => tag !== tagToRemove);
      if (this.node) {
        this.setState({tags});
        this.focusInput();
      }
      return tags;
    }, this.focusInput);
  }

  clickHandler = (event: SyntheticEvent) => {
    if (event.target !== this.node && (event.target as HTMLElement).parentElement !== this.node) {
      return;
    }

    // eslint-disable-next-line no-underscore-dangle
    this.select?._clickHandler();
  };

  filterExistingTags = (suggestions: readonly SelectItem[]) => {
    const tagsMap = new Map(this.state.tags.map(tag => [tag.key, tag]));
    return suggestions.filter(suggestion => !tagsMap.has(suggestion.key));
  };

  loadSuggestions = (query = '') =>
    this.setState({loading: true, query}, async () => {
      try {
        const suggestionsResult = this.props.dataSource({query});
        const allSuggestions = Array.isArray(suggestionsResult) ? suggestionsResult : await suggestionsResult;

        const suggestions = this.filterExistingTags(allSuggestions);
        if (this.node && query === this.state.query) {
          this.setState({suggestions, loading: false});
        }
      } catch (e) {
        this.setState({loading: false});
      }
    });

  private _focusHandler = () => {
    this.setActiveIndex(null);
    this.setState({focused: true});
  };

  private _blurHandler = () => {
    this.setState({focused: false});
  };

  selectTag = (moveForward?: boolean) => {
    const activeIndex =
      typeof this.state.activeIndex === 'number' ? this.state.activeIndex : this.state.tags.length + 1;
    let newActiveIndex = activeIndex + (moveForward ? 1 : -1);

    if (newActiveIndex >= this.state.tags.length) {
      newActiveIndex = this.state.tags.length - 1;
    } else if (newActiveIndex < 0) {
      newActiveIndex = 0;
    }

    if (this.state.activeIndex !== newActiveIndex) {
      this.setActiveIndex(newActiveIndex);
    }
  };

  // eslint-disable-next-line complexity
  handleKeyDown = (event: React.KeyboardEvent) => {
    const key = getEventKey(event);
    const isInputFocused = () =>
      event.target instanceof Element && event.target.matches(this.getInputNode()?.tagName ?? '');

    if (key === ' ' && this.props.allowAddNewTags) {
      event.stopPropagation();
      const value = this.getInputNode()?.value;
      if (value) {
        this.handleTagCreation(value);
      }
      return true;
    }

    // eslint-disable-next-line no-underscore-dangle
    if (this.select?._popup?.isVisible()) {
      return true;
    }

    if (key === 'ArrowLeft') {
      if (this.getInputNode() && this.caret && Number(this.caret?.getPosition()) > 0) {
        return true;
      }

      this.selectTag();
      return false;
    }

    if (key === 'ArrowRight' && !isInputFocused()) {
      if (this.state.activeIndex === this.state.tags.length - 1) {
        if (!this.props.disabled) {
          this.getInputNode()?.focus();
          this.setActiveIndex();
        }
      } else {
        this.selectTag(true);
      }
      return false;
    }

    if (!this.props.disabled) {
      if (key === 'Backspace' && !this.getInputNode()?.value) {
        event.preventDefault();
        const tagsLength = this.state.tags.length;
        // eslint-disable-next-line no-underscore-dangle
        this.select?._hidePopup(true); // otherwise confirmation may be overlapped by popup
        this.onRemoveTag(this.state.tags[tagsLength - 1]);
        return false;
      }

      if (
        (key === 'Delete' || key === 'Backspace') &&
        this.state.activeIndex !== null &&
        this.state.activeIndex !== undefined &&
        this.state.tags[this.state.activeIndex]
      ) {
        this.onRemoveTag(this.state.tags[this.state.activeIndex]).then(() => this.selectTag(true));
        return false;
      }
    }

    return true;
  };

  handleClick = memoize((tag: TagType) => () => {
    this.setActiveIndex(this.state.tags.indexOf(tag));
  });

  handleRemove = memoize((tag: TagType) => () => this.onRemoveTag(tag));

  handleTagCreation = (label: string | undefined) => {
    this.addTag({key: label, label});
  };

  select?: Select | null;
  selectRef = (el: Select | null) => {
    this.select = el;
  };

  render() {
    const {focused, tags, activeIndex} = this.state;

    const {
      disabled,
      canNotBeEmpty,
      allowAddNewTags,
      filter,
      size,
      labelType,
      height = typeof this.context === 'function' ? this.context() : this.context,
      label,
    } = this.props;

    const classes = classNames(
      styles.tagsInput,
      [inputStyles[`size${size}`]],
      [inputStyles[`height${height}`]],
      {
        [styles.tagsInputDisabled]: disabled,
        [styles.tagsInputFocused]: focused,
      },
      this.props.className,
    );

    return (
      <div
        // it transfers focus to input
        role='presentation'
        className={classes}
        onKeyDown={this.handleKeyDown}
        onClick={this.clickHandler}
        ref={this.nodeRef}
      >
        {label && (
          <ControlLabel htmlFor={this.id} disabled={disabled} type={labelType}>
            {label}
          </ControlLabel>
        )}

        <TagsList
          tags={tags}
          activeIndex={activeIndex}
          disabled={disabled}
          canNotBeEmpty={canNotBeEmpty}
          handleRemove={this.handleRemove}
          className={styles.tagsList}
          tagClassName={styles.tag}
          handleClick={this.handleClick}
          customTagComponent={this.props.customTagComponent}
        >
          <Select
            id={this.id}
            ref={this.selectRef}
            size={Select.Size.AUTO}
            type={Select.Type.INPUT_WITHOUT_CONTROLS}
            inputPlaceholder={this.props.placeholder}
            data={this.state.suggestions}
            className={classNames(styles.tagsSelect)}
            onSelect={this.addTag}
            onFocus={this._focusHandler}
            onBlur={this._blurHandler}
            renderOptimization={this.props.renderOptimization}
            add={allowAddNewTags ? {prefix: 'Add new tag'} : undefined}
            onAdd={allowAddNewTags ? this.handleTagCreation : undefined}
            filter={filter}
            maxHeight={this.props.maxPopupHeight}
            minWidth={this.props.minPopupWidth}
            top={POPUP_VERTICAL_SHIFT}
            loading={this.state.loading}
            onFilter={this.loadSuggestions}
            onBeforeOpen={this.loadSuggestions}
            onKeyDown={this.handleKeyDown}
            disabled={this.props.disabled}
            loadingMessage={this.props.loadingMessage}
            notFoundMessage={this.props.notFoundMessage}
            hint={this.props.hint}
          />
        </TagsList>
      </div>
    );
  }
}

export const RerenderableTagsInput = rerenderHOC(TagsInput);
export type TagsInputAttrs = React.JSX.LibraryManagedAttributes<typeof TagsInput, TagsInputProps>;

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import getEventKey from '../global/get-event-key';
import Select from '../select/select';
import TagsList from '../tags-list/tags-list';
import Caret from '../caret/caret';
import memoize from '../global/memoize';
import rerenderHOC from '../global/rerender-hoc';

import styles from './tags-input.css';

function noop() {}

/**
 * @name Tags Input
 */

const POPUP_VERTICAL_SHIFT = 2;

export default class TagsInput extends Component {
  static ngModelStateField = 'tags';

  static propTypes = {
    className: PropTypes.string,
    tags: PropTypes.array,
    /**
     * Datasource should return array(or promise) of suggestions.
     * Each suggestion should contain key and label fields.
     * DataSource should handle caching and response racing (when later request
     * responded earlier) by himself.
     */
    dataSource: PropTypes.func,
    onAddTag: PropTypes.func,
    onRemoveTag: PropTypes.func,
    customTagComponent: (props, propName, componentName) => {
      if (props[propName] && !props[propName].prototype instanceof Component) {
        return new Error(`Invalid prop ${propName} supplied to ${componentName}. Validation failed.`);
      }
      return null;
    },
    maxPopupHeight: PropTypes.number,
    minPopupWidth: PropTypes.number,
    placeholder: PropTypes.string,
    canNotBeEmpty: PropTypes.bool,
    disabled: PropTypes.bool,
    autoOpen: PropTypes.bool,
    renderOptimization: PropTypes.bool,
    legacyMode: PropTypes.bool,
    filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({fn: PropTypes.func})]),

    loadingMessage: PropTypes.string,
    notFoundMessage: PropTypes.string,
    allowAddNewTags: PropTypes.bool
  };

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
    legacyMode: false,
    allowAddNewTags: false,
    filter: {fn: () => true},
    placeholder: 'Select an option'
  };

  state = {
    tags: [],
    suggestions: [],
    loading: true,
    focused: false,
    query: '',
    activeIndex: 0
  };

  UNSAFE_componentWillMount() {
    this.updateStateFromProps(this.props);
  }

  componentDidMount() {
    if (this.props.autoOpen && !this.props.disabled) {
      this.focusInput();
      this.loadSuggestions();
      this.select._showPopup();
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.updateStateFromProps(props);
  }

  nodeRef = node => {
    this.node = node;
  };

  ngModelStateField = TagsInput.ngModelStateField;

  getInputNode() {
    if (!this.input) {
      this.input = this.select.filter;
      this.caret = new Caret(this.input);
    }
    return this.input;
  }

  setActiveIndex(activeIndex) {
    this.setState({activeIndex});
  }

  updateStateFromProps(props) {
    if (props.tags) {
      this.setState({tags: props.tags});
      this.setActiveIndex(props.tags.length);
    }
  }

  focusInput = () => {
    this.getInputNode().focus();
  };

  addTag = tag => {
    const isUniqueTag = this.state.tags.filter(item => tag.key === item.key).length === 0;
    this.select.clear();
    this.select.filterValue('');

    if (isUniqueTag) {
      this.setState(prevState => ({
        tags: prevState.tags.concat([tag])
      }));
      this.props.onAddTag({tag});
      this.setActiveIndex();
    }
  };

  onRemoveTag(tagToRemove) {
    return Promise.resolve(this.props.onRemoveTag({tag: tagToRemove})).
      then(() => {
        const tags = this.state.tags.filter(tag => tag !== tagToRemove);
        if (this.node) {
          this.setState({tags});
          this.focusInput();
        }
        return tags;
      }, this.focusInput);
  }

  clickHandler = event => {
    if (event.target !== this.node) {
      return;
    }

    this.loadSuggestions(this.getInputNode().value);
    this.focusInput();
  };

  filterExistingTags = suggestions => {
    const tagsMap = new Map(this.state.tags.map(tag => [tag.key, tag]));
    return suggestions.filter(suggestion => !tagsMap.has(suggestion.key));
  };

  loadSuggestions = query => {
    this.setState({loading: true, query});
    return Promise.resolve(this.props.dataSource({query})).
      then(this.filterExistingTags).
      then(suggestions => {
        if (this.node && query === this.state.query) {
          this.setState({suggestions, loading: false});
        }
      }).
      catch(() => this.node && this.setState({loading: false}));
  };

  _focusHandler = () => {
    this.setActiveIndex(null);
    this.setState({focused: true});
  };

  _blurHandler = () => {
    this.setState({focused: false});
  };

  selectTag = moveForward => {
    const activeIndex = typeof this.state.activeIndex === 'number'
      ? this.state.activeIndex
      : this.state.tags.length + 1;
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

  handleKeyDown = event => {
    const key = getEventKey(event);
    const isInputFocused = () => event.target.matches(this.getInputNode().tagName);

    if (key === ' ' && this.props.allowAddNewTags) {
      event.stopPropagation();
      const value = this.getInputNode().value;
      if (value !== '') {
        this.handleTagCreation(value);
      }
      return true;
    }

    if (this.select._popup.isVisible()) {
      return true;
    }


    if (key === 'ArrowLeft') {
      if (this.getInputNode() && this.caret.getPosition() > 0) {
        return true;
      }

      this.selectTag();
      return false;
    }

    if (key === 'ArrowRight' && !isInputFocused(event)) {
      if (this.state.activeIndex === this.state.tags.length - 1) {
        if (!this.props.disabled) {
          this.getInputNode().focus();
          this.setActiveIndex();
        }
      } else {
        this.selectTag(true);
      }
      return false;
    }

    if (!this.props.disabled) {
      if (key === 'Backspace' && !this.getInputNode().value) {
        event.preventDefault();
        const tagsLength = this.state.tags.length;
        this.select._hidePopup(true); // otherwise confirmation may be overlapped by popup
        this.onRemoveTag(this.state.tags[tagsLength - 1]);
        return false;
      }

      if ((key === 'Delete' || key === 'Backspace') && this.state.tags[this.state.activeIndex]) {
        this.onRemoveTag(this.state.tags[this.state.activeIndex]).
          then(() => this.selectTag(true));
        return false;
      }
    }

    return true;
  };

  handleClick = memoize(tag => () => {
    this.setActiveIndex(this.state.tags.indexOf(tag));
  });

  handleRemove = memoize(tag => () => this.onRemoveTag(tag));

  handleTagCreation = label => {
    this.addTag({key: label, label});
  };

  selectRef = el => {
    this.select = el;
  };

  render() {
    const {focused, tags, activeIndex} = this.state;
    const {legacyMode, disabled, canNotBeEmpty, allowAddNewTags, filter} = this.props;
    const classes = classNames(
      styles.tagsInput,
      {
        [styles.tagsInputDisabled]: disabled,
        [styles.tagsInputFocused]: focused,
        [styles.tagsInputLegacyMode]: legacyMode
      },
      this.props.className);

    return (
      <div
        className={classes}
        onKeyDown={this.handleKeyDown}
        onClick={this.clickHandler}
        ref={this.nodeRef}
      >
        <TagsList
          tags={tags}
          activeIndex={activeIndex}
          disabled={disabled}
          canNotBeEmpty={canNotBeEmpty}
          handleRemove={this.handleRemove}
          className={styles.tagsList}
          tagClassName={styles.tag}
          handleClick={this.handleClick}
        >
          <Select
            ref={this.selectRef}
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
          />
        </TagsList>

        {!legacyMode && <div className={styles.underline}/>}
        {!legacyMode && <div className={styles.focusUnderline}/>}
      </div>);
  }
}

export const RerenderableTagsInput = rerenderHOC(TagsInput, {captureNode: false});


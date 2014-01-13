/**
 * @fileoverview Single item in {@link SelectableList}.
 * @author igor.alexeenko (Igor Alekseyenko)
 */

define([
  'diff/diff__tools'
], function(d) {
  /**
   * @param {string} caption
   * @constructor
   */
  var SelectableListItem = function(caption) {
    /**
     * @type {string}
     * @private
     */
    this.caption_ = caption;
  };

  /**
   * @enum {number}
   */
  SelectableListItem.State = {
    NONE: 0x00,
    HOVERED: 0x01,
    SELECTED: 0x02
  };

  /**
   * @enum {string}
   */
  SelectableListItem.ClassName = {
    BASE: 'selectable-list__item',
    HOVERED: 'selectable-list__item_hovered',
    SELECTED: 'selectable-list__item_selected',
    SELECTEDHOVERED:
        'selectable-list__item_selected selectable-list__item_hovered'
  };

  /**
   * @type {string}
   * @private
   */
  SelectableListItem.prototype.caption_ = null;

  /**
   * @type {Element}
   * @private
   */
  SelectableListItem.prototype.element_ = null;

  /**
   * @type {SelectableListItem.State}
   * @private
   */
  SelectableListItem.prototype.state_ = SelectableListItem.State.NONE;

  /**
   * Creates DOM of element if this element is not decorated.
   * @param {Element} parent
   */
  SelectableListItem.prototype.createDOM = function(parent) {
    var element = document.createElement('div');
    element.innerHTML = this.caption_ || '';

    parent.appendChild(element);

    this.setElement(element);
  };

  /**
   * @param {SelectableListItem.State} state
   * @return {boolean}
   */
  SelectableListItem.prototype.hasState = function(state) {
    return Boolean(this.state_ & state);
  };

  /**
   * @return {SelectableListItem.State}
   */
  SelectableListItem.prototype.getState = function() {
    return this.state_;
  };

  /**
   * @param {SelectableListItem.State} state
   * @param {boolean} enabled
   */
  SelectableListItem.prototype.setState = function(state, enabled) {
    if (this.hasState(state) && !enabled || !this.hasState(state) && enabled) {
      this.state_ = enabled ? this.state_ | state : this.state_ & ~state;
      this.setStateInternal();
    }
  };

  SelectableListItem.prototype.setStateInternal = function() {
    if (!this.stateToClassName_) {
      /**
       * @type {Object.<SelectableListItem.State, string>}
       * @private
       */
      this.stateToClassName_ = d.createObject(
          SelectableListItem.State.NONE, '',
          SelectableListItem.State.HOVERED,
              SelectableListItem.ClassName.HOVERED,
          SelectableListItem.State.SELECTED,
              SelectableListItem.ClassName.SELECTED,
          SelectableListItem.State.SELECTED | SelectableListItem.State.HOVERED,
              SelectableListItem.ClassName.SELECTEDHOVERED);
    }

    this.element_.className = [
      SelectableListItem.ClassName.BASE,
      this.stateToClassName_[this.getState()]
    ].join(' ');
  };

  /**
   * @param {Element} element
   */
  SelectableListItem.prototype.setElement = function(element) {
    if (this.element_ === element) {
      return;
    }

    this.element_ = element;
    this.setStateInternal();
  };

  /**
   * @return {Element}
   */
  SelectableListItem.prototype.getElement = function() {
    return this.element_;
  };

  /**
   * Component disposal.
   */
  SelectableListItem.prototype.dispose = function() {
    this.element_.innerHTML = '';
    this.element_ = null;

    this.caption_ = null;
  };

  /**
   * @param {Element} element
   * @return {SelectableListItem}
   */
  SelectableListItem.decorate = function(element) {
    var selectableListItem = new SelectableListItem(element.innerText);
    selectableListItem.setElement(element);

    return selectableListItem;
  };

  return SelectableListItem;
});

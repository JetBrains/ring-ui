import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import focusSensorHOC from '../global/focus-sensor-hoc';
import Checkbox from '../checkbox/checkbox';

import styles from './data-list.css';


class Title extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.node,
    offset: PropTypes.number,
    selectable: PropTypes.bool,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
    showFocus: PropTypes.bool,
    collapserExpander: PropTypes.node,

    // focusSensorHOC
    onFocusRestore: PropTypes.func
  };

  static defaultProps = {
    selectable: false,
    selected: false,
    showFocus: false
  };


  onCheckboxFocus = () => {
    this.props.onFocusRestore();
  };

  onCheckboxChange = () => {
    this.toggleSelection();
  };

  toggleSelection() {
    const {selectable, selected, onSelect} = this.props;
    if (selectable) {
      onSelect(!selected);
    }
  }

  render() {
    const {
      className, title, offset, showFocus,
      selectable, selected, collapserExpander
    } = this.props;

    const classes = classNames(className, {
      [styles.title]: true,
      [styles.titleFocused]: showFocus,
      [styles.titleSelected]: selected
    });

    return (
      <div
        className={classes}
        style={{paddingLeft: offset}}
      >
        <div className={styles.boxes}>
          {selectable &&
            (
              <div className={styles.checkboxBox}>
                <Checkbox
                  className={showFocus ? 'ring-checkbox_focus' : ''}
                  checked={selected}
                  onFocus={this.onCheckboxFocus}
                  onChange={this.onCheckboxChange}
                  tabIndex="-1"
                />
              </div>
            )
          }

          {collapserExpander}
        </div>

        {title}
      </div>
    );
  }
}

export default focusSensorHOC(Title);

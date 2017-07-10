/* @flow */
import React, {PureComponent, Element} from 'react';
import classNames from 'classnames';

import focusSensorHOC from '../global/focus-sensor-hoc';
import Checkbox from '../checkbox/checkbox';

import styles from './data-list.css';

type Props = {
  className?: string,
  title: string,
  selectable: boolean,
  selected: boolean,
  onSelect: (selected: boolean) => void,
  showFocus: boolean,
  collapserExpander: any,

  // focusSensorHOC
  onFocusRestore: () => void
};

class ItemTitle extends PureComponent {
  static defaultProps = {
    selectable: false,
    selected: false,
    showFocus: false
  };

  props: Props;

  onCheckboxFocus = (): void => {
    this.props.onFocusRestore();
  }

  onCheckboxChange = (): void => {
    this.toggleSelection();
  }

  toggleSelection(): void {
    const {selectable, selected, onSelect} = this.props;
    if (selectable) {
      onSelect(!selected);
    }
  }

  render(): Element<any> {
    const {
      className, title, showFocus,
      selectable, selected, collapserExpander
    } = this.props;

    const classes = classNames(className, {
      [styles.itemTitle]: true,
      [styles.itemTitleFocused]: showFocus,
      [styles.itemTitleSelected]: selected
    });

    return (
      <div className={classes}>
        <div className={styles.metaColumn}>
          {selectable &&
            <Checkbox
              className={showFocus ? 'ring-checkbox_focus' : ''}
              checked={selected}
              onFocus={this.onCheckboxFocus}
              onChange={this.onCheckboxChange}
              tabIndex="-1"
            />
          }

          {collapserExpander}
        </div>

        {title}
      </div>
    );
  }
}

export default focusSensorHOC(ItemTitle);

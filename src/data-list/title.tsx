import {PureComponent, ReactNode} from 'react';
import classNames from 'classnames';

import focusSensorHOC, {FocusSensorAddProps} from '../global/focus-sensor-hoc';
import Checkbox from '../checkbox/checkbox';

import getUID from '../global/get-uid';

import styles from './data-list.css';

export interface TitleProps extends FocusSensorAddProps<HTMLDivElement> {
  onSelect: (selected: boolean) => void;
  selectable?: boolean | undefined;
  selected?: boolean | undefined;
  showFocus?: boolean | undefined;
  offset?: number | undefined;
  className?: string | null | undefined;
  title?: ReactNode;
  collapserExpander?: ReactNode;
}

class Title extends PureComponent<TitleProps> {
  static defaultProps = {
    selectable: false,
    selected: false,
    showFocus: false,
  };

  id = getUID('data-list-title');

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
    const {className, title, offset, showFocus, innerRef, selectable, selected, collapserExpander} = this.props;

    const classes = classNames(className, {
      [styles.title]: true,
      [styles.titleFocused]: showFocus,
      [styles.titleSelected]: selected,
    });

    return (
      <div id={this.id} className={classes} style={{paddingLeft: offset}} ref={innerRef}>
        <div className={styles.boxes}>
          {selectable && (
            <div className={styles.checkboxBox}>
              <Checkbox
                aria-labelledby={this.id}
                className={showFocus ? 'ring-checkbox_focus' : ''}
                checked={selected}
                onFocus={this.onCheckboxFocus}
                onChange={this.onCheckboxChange}
                tabIndex={-1}
              />
            </div>
          )}

          {collapserExpander}
        </div>

        {title}
      </div>
    );
  }
}

export default focusSensorHOC<HTMLDivElement, TitleProps, typeof Title>(Title);

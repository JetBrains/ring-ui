/* @flow */
/* eslint-disable react/jsx-no-literals */
import React, {PureComponent, Element} from 'react';
import classNames from 'classnames';

import focusSensorHOC from '../global/focus-sensor-hoc';
import Checkbox from '../checkbox/checkbox';

import styles from './data-list.css';

type Props = {
  className?: string,
  title: string,
  focused: boolean,
  selectable: boolean,
  selected: boolean
};

class GroupTitle extends PureComponent {
  static defaultProps = {
    selectable: false,
    selected: false
  };

  props: Props;

  onCheckboxFocus = (): void => {
    //this.props.onFocusRestore();
  }

  onCheckboxChange = (): void => {
    //this.toggleSelection();
  }

  render(): Element<any> {
    const {
      className, title, focused,
      selectable, selected
    } = this.props;

    const classes = classNames(className, {
      [styles.groupTitle]: true,
      [styles.groupTitleFocused]: focused
    });

    return (
      <div className={classes}>
        {selectable &&
          <Checkbox
            className={focused ? 'ring-checkbox_focus' : ''}
            checked={selected}
            onFocus={this.onCheckboxFocus}
            onChange={this.onCheckboxChange}
            tabIndex="-1"
          />
        }

        {title}
      </div>
    );
  }
}

export default focusSensorHOC(GroupTitle);

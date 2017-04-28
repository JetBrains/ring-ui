/* @flow */
/* eslint-disable react/jsx-max-props-per-line */

/**
  * @name Data List
  * @category Components
  * @framework React
  * @extends {PureComponent}
  * @description TODO add Data List description
  * @example-file ./data-list.examples.html
  */

import React, {PureComponent, Element} from 'react';
import classNames from 'classnames';

import Item from './item';
import styles from './data-list.css';

type ItemType = {
  id: number,
  title: any,
  selectable?: boolean
};

type GroupType = {
  id: number,
  title: any,
  size: number,
  items: ItemType[]
};

type Props = {
  data: GroupType[],
  className?: string
};

export default class DataList extends PureComponent {
  props: Props;

  render(): Element<any> {
    const {data, className} = this.props;

    console.log(this.props); // eslint-disable-line no-console

    return (
      <ul className={classNames(styles.dataList, className)}>
        {data.map(group => (
          <li key={group.id}>

            <div className={styles.groupTitle}>{group.title}</div>

            {group.items.length ? (
              <ul className={styles.group}>
                {group.items.map(({id, title, selectable}) => (
                  <Item key={id} title={title} selectable={selectable}/>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    );
  }
}

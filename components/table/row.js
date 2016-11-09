import 'core-js/modules/es6.number.is-finite';

import React, {PropTypes} from 'react';
import RingComponent from '../ring-component/ring-component';

import Link from '../link/link';

import Cell from './cell';
import style from './table.css';

export class DefaultRenderer extends RingComponent {
  static propTypes = {
    item: PropTypes.any.isRequired,
    column: PropTypes.any.isRequired
  }

  render() {
    const {item, column} = this.props;
    return <Cell>{item[column.id]}</Cell>;
  }
}

export class NumberRenderer extends DefaultRenderer {
  render() {
    const {item, column} = this.props;
    const value = item[column.id];
    return <Cell className={style.cellRight}>{value}</Cell>;
  }
}

export class URLRenderer extends DefaultRenderer {
  render() {
    const {item, column} = this.props;
    const value = item[column.id];

    let url;
    let title;

    if (value.url && value.title) {
      url = value.url;
      title = value.title;
    } else if (value.url) {
      url = title = value.url;
    } else {
      url = title = value;
    }

    return <Cell><Link href={url}>{title}</Link></Cell>;
  }
}

export default class Row extends RingComponent {
  render() {
    const {item, columns} = this.props;
    return (
      <tr>{
        columns.map((column, key) => {
          const value = item[column.id];
          let Renderer = column.renderer;

          if (!Renderer) {
            if (Number.isFinite(value)) {
              Renderer = NumberRenderer;
            } else {
              Renderer = DefaultRenderer;
            }
          }

          /*let gap = 0;
          if (column.groupable) {
            gap = item.__level * 10;
          }

          const style = {
            paddingLeft: `${gap + 10}px`
          };*/

          const props = {key, item, column};
          return <Renderer {...props} />;
        })
      }</tr>
    );
  }
}

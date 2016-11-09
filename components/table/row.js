import 'core-js/modules/es6.number.is-finite';

import React from 'react';
import RingComponent from '../ring-component/ring-component';
import DefaultRenderer from './default-renderer';
import NumberRenderer from './number-renderer';

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

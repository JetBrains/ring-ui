/**
 * @name Table
 * @category Components
 * @framework React
 * @extends {ReactComponent}
 * @description The table.
 * @example-file ./table.examples.html
 */

import 'core-js/modules/es6.array.find';

import React, {PropTypes} from 'react';
import RingComponent from '../ring-component/ring-component';
import classNames from 'classnames';

import HeaderCell from './header-cell';
import Row from './row';
import style from './table.css';

import LoaderInline from '../loader-inline/loader-inline';

export default class Table extends RingComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    onSort: PropTypes.func,
    sortKey: PropTypes.string,
    sortOrder: PropTypes.bool
  }

  state = {
    focusedRow: undefined
  }

  onRowFocus = focusedRow => {
    this.setState({focusedRow});
  }

  render() {
    const {loading, onSort, sortKey, sortOrder} = this.props;

    const columns = this.props.columns.filter(column => !column.subtree);

    /*const subtreeKey = do {
      const subtreeColumn = this.props.columns.find(column => column.subtree);
      if (subtreeColumn) {
        subtreeColumn.id;
      }
    };

    function flattenSubtree(item, subtreeKey, level) { // eslint-disable-line no-shadow
      const result = [];
      if (item[subtreeKey]) {
        item[subtreeKey].forEach(subItem => {
          subItem.__level = level;
          result.push(subItem);
          const subtree = flattenSubtree(subItem, subtreeKey, level + 1);
          subtree.forEach(subitem => {
            result.push(subitem);
          });
        });
      }
      return result;
    }*/

    const data = [];
    this.props.data.forEach(item => {
      item.__level = 0;
      data.push(item);
      /*if (subtreeKey) {
        const subtree = flattenSubtree(item, subtreeKey, 1);
        subtree.forEach(subitem => {
          data.push(subitem);
        });
      }*/
    });

    const wrapperClasses = classNames({
      [style.tableWrapper]: true,
      [style.loading]: loading
    });

    return (
      <div className={wrapperClasses}>
        <LoaderInline className={style.loader}/>

        <table className={style.table}>
          <thead>
            <tr>{
              columns.map((column, key) => {
                const props = {key, column, onSort, sortKey, sortOrder};
                return <HeaderCell {...props} />;
              })
            }</tr>
          </thead>

          <tbody>{
            data.map((item, key) => {
              const focused = this.state.focusedRow === item;
              const onFocus = this.onRowFocus.bind(this, item);
              const props = {key, item, columns, focused, onFocus};
              return <Row {...props} />;
            })
          }</tbody>
        </table>
      </div>
    );
  }
}

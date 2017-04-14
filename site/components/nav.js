import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Input from '../../components/input/input';
import List from '../../components/list/list';
import Markdown from '../../components/markdown/markdown';
import fuzzyHighlight from '../../components/global/fuzzy-highlight';
import {currentPath} from '../utils';
import styles from '../index.css';

import Item from './item';

function makeFilter(filter) {
  const needle = filter.trim();
  if (needle === '') {
    return null;
  }

  return haystack => fuzzyHighlight(needle, haystack);
}

const filterItems = (items, filterFn) =>
  items.
    map(({title, ...rest}) => ({
      filtered: filterFn(title),
      ...rest
    })).
    filter(({filtered}) => filtered.matched).
    map(({filtered, ...rest}) => ({
      title: (
        <Markdown
          inline={true}
          source={filtered.highlight}
        />
      ),
      ...rest
    }));

const groupListItem = name => ({
  rgItemType: List.ListProps.Type.TITLE,
  label: name,
  key: name
});

const linkListItem = ({url, title}) => ({
  rgItemType: List.ListProps.Type.LINK,
  href: url,
  active: url === currentPath(),
  label: title,
  key: url
});

class Nav extends PureComponent {
  state = {
    filter: ''
  }

  render() {
    const {categories} = this.props;
    const {filter} = this.state;
    const filterFn = makeFilter(filter);
    const filteredCategories = filterFn
      ? categories.
          map(({items, ...rest}) => ({
            items: filterItems(items, filterFn),
            ...rest
          })).
          filter(({items}) => items.length > 0)
      : categories;

    // [].concat(...arrs) === arrs.flatten()
    const data = [].concat(
      ...filteredCategories.map(({name, items}) => [
        groupListItem(name),
        ...items.map(linkListItem)
      ])
    );

    return (
      <div className={styles.sidebar}>
        <Input
          className="ring-js-shortcuts"
          autoFocus={true}
          placeholder="Search components"
          value={filter}
          onChange={e => this.setState({
            filter: e.target.value
          })}
        />
        <List
          className={styles.list}
          shortcuts={true}
          activeIndex={filterFn && 1}
          {...{data}}
        />
      </div>
    );
  }
}

Nav.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape(Item.propTypes))
  }))
};

export default Nav;

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Input, {Size} from '@jetbrains/ring-ui/components/input/input';
import List from '@jetbrains/ring-ui/components/list/list';
import Markdown from '@jetbrains/ring-ui/components/markdown/markdown';
import fuzzyHighlight from '@jetbrains/ring-ui/components/global/fuzzy-highlight';

import {currentPath} from './utils';
import styles from './index.css';

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
  label: name === 'Docs' ? 'Ring UI' : name,
  key: name,
  className: styles.item
});

const linkListItem = ({url, title, legacy}) => {
  const active = url === currentPath();

  return {
    rgItemType: List.ListProps.Type.LINK,
    href: url,
    active
    ,
    label: title,
    key: url,
    className: classNames(styles.item, {
      [styles.legacy]: legacy,
      [styles.active]: active
    })
  };
};

class Nav extends PureComponent {
  state = {
    filter: ''
  };

  setFilter = e => this.setState({
    filter: e.target.value
  });

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
      <div className={styles.nav}>
        <Input
          size={Size.AUTO}
          className={classNames(styles.item, 'ring-js-shortcuts')}
          autoFocus={true}
          placeholder="Search components"
          value={filter}
          onChange={this.setFilter}
        />
        <List
          renderOptimization={false}
          className={styles.list}
          shortcuts={true}
          activeIndex={filterFn && 1}
          compact={true}
          {...{data}}
        />
      </div>
    );
  }
}

Nav.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string
    }))
  }))
};

export default Nav;

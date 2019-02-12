import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {SearchIcon} from '@jetbrains/ring-ui/components/icon';
import Input, {Size, Theme} from '@jetbrains/ring-ui/components/input/input';
import List from '@jetbrains/ring-ui/components/list/list';
import PopupMenu from '@jetbrains/ring-ui/components/popup-menu/popup-menu';
import Markdown from '@jetbrains/ring-ui/components/markdown/markdown';
import fuzzyHighlight from '@jetbrains/ring-ui/components/global/fuzzy-highlight';

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
  key: name
});

const linkListItem = ({url, title}) => {
  return {
    rgItemType: List.ListProps.Type.LINK,
    href: url,
    label: title,
    key: url
  };
};

class Search extends PureComponent {
  state = {
    filter: '',
    open: false,
  };

  setFilter = e => this.setState({
    filter: e.target.value,
    open: true,
  });

  close = () => this.setState({open: false});

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
    const data = filteredCategories.length > 0 ? [].concat(
      ...filteredCategories.map(({name, items}) => [
        groupListItem(name),
        ...items.map(linkListItem)
      ])
    ) : [groupListItem('Nothing found')];

    return (
      <div className={styles.search}>
        <SearchIcon className={styles.searchIcon}/>
        <Input
          borderless
          theme={Theme.DARK}
          className={classNames(styles.searchInput, 'ring-js-shortcuts')}
          autoFocus={true}
          placeholder="Search"
          value={filter}
          onChange={this.setFilter}
        />
        <PopupMenu
          hidden={!this.state.open}
          onCloseAttempt={this.close}
          dontCloseOnAnchorClick
          top={-8}
          minWidth={PopupMenu.PopupProps.MinWidth.TARGET}
          maxHeight={PopupMenu.PopupProps.MaxHeight.SCREEN}
          directions={[PopupMenu.PopupProps.Directions.BOTTOM_RIGHT]}
          className={styles.list}
          shortcuts={true}
          activateFirstItem
          compact={true}
          {...{data}}
        />
      </div>
    );
  }
}

Search.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string,
      title: PropTypes.string
    }))
  }))
};

export default Search;

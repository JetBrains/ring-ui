import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import List from '@jetbrains/ring-ui/components/list/list';

import {currentPath} from './utils';
import styles from './index.css';

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

const Nav = ({categories}) => {
  // [].concat(...arrs) === arrs.flatten()
  const data = [].concat(
    ...categories.map(({name, items}) => [
      groupListItem(name),
      ...items.map(linkListItem)
    ])
  );

  return (
    <div className={styles.nav}>
      <List
        renderOptimization={false}
        className={styles.list}
        shortcuts={true}
        compact={true}
        {...{data}}
      />
    </div>
  );
};

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

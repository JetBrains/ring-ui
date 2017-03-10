import React, {PropTypes, PureComponent} from 'react';

import Input from 'ring-ui/components/input/input';
import fuzzyHighlight from 'ring-ui/components/global/fuzzy-highlight';

import Category from './category';

import styles from '../index.css';

function makeFilter(filter) {
  const needle = filter.trim();
  if (needle === '') {
    return null;
  }

  return haystack => fuzzyHighlight(needle, haystack);
}

class Nav extends PureComponent {
  state = {
    filter: ''
  }

  render() {
    const {categories} = this.props;
    const {filter} = this.state;
    const filterFn = makeFilter(filter);
    return (
      <div className={styles.sidebar}>
        <Input
          autoFocus={true}
          placeholder="Search components"
          value={filter}
          onChange={e => this.setState({
            filter: e.target.value
          })}
        />
        <div className={styles.categories}>
          {categories.map(category =>
            <Category
              {...{filterFn}}
              {...category}
              key={category.name}
            />
          )}
        </div>
      </div>
    );
  }
}

Nav.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape(Category.propTypes))
};

export default Nav;

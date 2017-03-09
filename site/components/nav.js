import React, {PropTypes, PureComponent} from 'react';

import Input from 'ring-ui/components/input/input';

import Category from './category';

import styles from '../index.css';

function makeFilter(filter) {
  const trimmed = filter.trim();
  if (trimmed === '') {
    return null;
  }

  const RE = new RegExp(trimmed.replace(/\s/g, '\\s'), 'ig');

  return item => ({
    match: RE.test(item),
    highlight: item.replace(RE, '**$&**')
  });
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

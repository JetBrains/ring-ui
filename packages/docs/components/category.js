import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@jetbrains/ring-ui/components/button/button';
import Link from '@jetbrains/ring-ui/components/link/link';
import {ChevronRightIcon} from '@jetbrains/ring-ui/components/icon';

import {currentPath} from './utils';
import styles from './index.css';

const ITEM_HEIGHT = 24;

const linkItem = ({url, title, legacy}) => {
  const active = url === currentPath();

  const classes = classNames(styles.item, {
    [styles.legacy]: legacy,
    [styles.active]: active
  });

  return (
    <Link key={url} href={url} className={classes}>
      {title}
    </Link>
  );
};

export default class Category extends PureComponent {
  state = {
    expanded: !this.props.collapsible || this.props.initExpanded
  };

  toggle = () => this.setState(prevState => ({
    expanded: !prevState.expanded
  }));

  render() {
    const {collapsible, name, items} = this.props;
    const {expanded} = this.state;

    const chevronClasses = classNames(styles.chevron, {
      [styles.chevronExpanded]: expanded
    });

    return (
      <Fragment>
        {collapsible ? (
          <Button text className={styles.category} onClick={this.toggle}>
            <ChevronRightIcon className={chevronClasses} />
            {name}
          </Button>
        ) : <div className={styles.category}>{name}</div>}
        <div
          className={styles.items}
          style={{height: expanded ? ITEM_HEIGHT * items.length : 0}}
        >
          {items.map(linkItem)}
        </div>
      </Fragment>
    )
  }
}

Category.propTypes = {
  collapsible: PropTypes.bool,
  initExpanded: PropTypes.bool,
  name: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    legacy: PropTypes.bool
  }))
};

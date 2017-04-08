import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Link from '../link/link';

import styles from './services.css';

export default class ServicesLink extends PureComponent {
  static propTypes = {
    isActive: PropTypes.bool,
    service: PropTypes.shape({
      applicationName: PropTypes.string,
      iconUrl: PropTypes.string,
      homeUrl: PropTypes.string,
      name: PropTypes.string
    })
  };

  render() {
    const {service, ...props} = this.props;

    return (
      <Link
        target="_self"
        href={service.homeUrl}
        {...props}
      >
        {service.iconUrl && (
          <span
            className={styles.itemLogo}
            style={{backgroundImage: `url(${service.iconUrl})`}}
          />
        )}
        {service.iconUrl && (
          <span className={styles.itemText}>{service.name}</span>
        )}
        {!service.iconUrl && service.name}
      </Link>
    );
  }

}

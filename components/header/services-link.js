import React, {PropTypes, PureComponent} from 'react';

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
    const {service, isActive, ...restProps} = this.props;

    const linkProps = {
      target: '_self',
      href: service.homeUrl
    };

    const tagProps = isActive ? restProps : {...linkProps, ...restProps};

    return (
      <a {...tagProps}>
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
      </a>
    );
  }

}

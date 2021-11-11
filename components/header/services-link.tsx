import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Link, {LinkProps} from '../link/link';

import styles from './services.css';

export interface Service {
  id: string
  applicationName: string
  iconUrl?: string | null | undefined
  homeUrl: string
  name: string
}

export interface ServicesLinkProps extends Partial<LinkProps> {
  service: Service
}

export default class ServicesLink extends PureComponent<ServicesLinkProps> {
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
        {WrapText => (service.iconUrl
          ? [
            <span
              key="icon"
              className={styles.itemLogo}
              style={{backgroundImage: `url(${service.iconUrl})`}}
            />,
            <div key="text">
              <WrapText>{service.name}</WrapText>
            </div>
          ]
          : <WrapText>{service.name}</WrapText>)
        }
      </Link>
    );
  }

}

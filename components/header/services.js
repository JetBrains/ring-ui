import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import servicesGlyph from 'jetbrains-icons/services.svg';

import Dropdown from '../dropdown/dropdown';
import Popup from '../popup/popup';

import TrayIcon from './tray-icon';
import ServicesLink from './services-link';
import styles from './services.css';

export default class Services extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    clientId: PropTypes.string,
    initShown: PropTypes.bool,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    services: PropTypes.arrayOf(ServicesLink.propTypes.service)
  };

  static Link = ServicesLink
  static sort = (a, b) => {
    const aApplicationName = a.applicationName || '';
    const bApplicationName = b.applicationName || '';

    return aApplicationName.localeCompare(bApplicationName) ||
      a.name.localeCompare(b.name);
  }

  serviceIsActive = service => service.id === this.props.clientId

  render() {
    // eslint-disable-next-line no-unused-vars
    const {className, clientId, loading, services, initShown, ...props} = this.props;

    const classes = classnames(className, {
      ['ring-icon_loading']: loading
    });

    if (!services) {
      return (
        <TrayIcon
          {...props}
          active={loading}
          className={classes}
          glyph={servicesGlyph}
        />
      );
    }

    const sortedServices = services.sort(Services.sort);
    const servicesWithIcons = sortedServices.filter(service => service.iconUrl);
    const servicesWithOutIcons = sortedServices.filter(service => !service.iconUrl);
    const separatorIsRequired = servicesWithIcons.length !== 0 && servicesWithOutIcons.length !== 0;
    const anchor = ({active}) => (
      <TrayIcon
        active={active}
        glyph={servicesGlyph}
      />
    );

    return (
      <Dropdown
        {...props}
        anchor={anchor}
        className={className}
        initShown={initShown}
      >
        <Popup className={styles.services}>
          {servicesWithIcons.map(service => {
            const isActive = this.serviceIsActive(service);

            return (
              <Services.Link
                active={isActive}
                className={isActive ? styles.activeItem : styles.item}
                key={service.id}
                service={service}
              />
            );
          })}
          {separatorIsRequired && (
            <div
              className={styles.line}
              key="separator"
            />
          )}
          {servicesWithOutIcons.map(service => {
            const isActive = this.serviceIsActive(service);

            return (
              <Services.Link
                active={isActive}
                className={isActive ? styles.activeItemStacked : styles.itemStacked}
                key={service.id}
                service={service}
              />
            );
          })}
        </Popup>
      </Dropdown>
    );
  }
}

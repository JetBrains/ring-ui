import React, {HTMLAttributes, PureComponent} from 'react';
import PropTypes from 'prop-types';
import servicesIcon from '@jetbrains/icons/services-20px';

import classNames from 'classnames';

import Dropdown, {AnchorProps} from '../dropdown/dropdown';
import Popup from '../popup/popup';

import Theme from '../global/theme';
import darkStyles from '../global/variables_dark.css';

import TrayIcon from './tray-icon';
import ServicesLink, {Service} from './services-link';
import styles from './services.css';

const makeAnchor = (loading: boolean | null | undefined) => {
  const Anchor = ({active}: AnchorProps) => (
    <TrayIcon
      loader={loading}
      active={active}
      icon={servicesIcon}
      aria-label="Services"
    />
  );

  Anchor.propTypes = {
    active: PropTypes.bool
  };

  return Anchor;
};

export interface ServicesProps extends HTMLAttributes<HTMLElement> {
  theme: Theme
  clientId?: string | null | undefined
  initShown?: boolean | undefined
  loading?: boolean | null | undefined
  services?: Service[] | null | undefined
}

export default class Services extends PureComponent<ServicesProps> {
  static sort = (a: Service, b: Service) => {
    const aApplicationName = a.applicationName || '';
    const bApplicationName = b.applicationName || '';

    return aApplicationName.localeCompare(bApplicationName) ||
      a.name.localeCompare(b.name);
  };

  static propTypes = {
    className: PropTypes.string,
    clientId: PropTypes.string,
    initShown: PropTypes.bool,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    services: PropTypes.arrayOf(ServicesLink.propTypes.service)
  };

  static defaultProps = {
    theme: Theme.DARK
  };

  static Link = ServicesLink;

  serviceIsActive = (service: Service) => service.id === this.props.clientId;

  render() {
    const {clientId, loading, services, initShown, theme, ...props} = this.props;

    if (!services) {
      return (
        <TrayIcon
          {...props}
          loader={loading}
          active={loading}
          icon={servicesIcon}
          aria-label="Services"
        />
      );
    }

    const sortedServices = [...services].sort(Services.sort);
    const servicesWithIcons = sortedServices.filter(service => service.iconUrl);
    const servicesWithOutIcons = sortedServices.filter(service => !service.iconUrl);
    const separatorIsRequired = servicesWithIcons.length !== 0 && servicesWithOutIcons.length !== 0;

    return (
      <Dropdown
        {...props}
        anchor={makeAnchor(loading)}
        initShown={initShown}
      >
        <Popup
          className={classNames(styles.services, {[darkStyles.dark]: theme === Theme.DARK})}
          top={-3}
        >
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

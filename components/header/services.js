import React, {PropTypes, Component} from 'react';
import classnames from 'classnames';

import servicesGlyph from 'jetbrains-icons/services.svg';

import Auth from '../auth/auth';
import Dropdown from '../dropdown/dropdown';
import Popup from '../popup/popup';

import TrayIcon from './tray-icon';
import styles from './services.css';

function noop() {}

export default class Services extends Component {
  static propTypes = {
    auth: PropTypes.instanceOf(Auth).isRequired,
    className: PropTypes.string,
    translations: PropTypes.string
  };

  static allFields = 'id,name,applicationName,homeUrl,iconUrl';
  static countFields = 'key';
  static Link = props => {
    // eslint-disable-next-line react/prop-types
    const {service, isActive, ...restProps} = props;

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

  static sort = (a, b) => {
    const aApplicationName = a.applicationName || '';
    const bApplicationName = b.applicationName || '';

    return aApplicationName.localeCompare(bApplicationName) ||
      a.name.localeCompare(b.name);
  }

  state = {
    visible: true,
    loading: false,
    services: null
  }

  stopLoading = () => {
    this.setState({loading: false});
  }

  getServicesContent = () => {
    this.setState({loading: true});

    this.getServices(Services.allFields).then(services => {
      this.setState({services});
      this.stopLoading();
    }).catch(this.stopLoading);
  }

  serviceIsActive = service => service.id === this.props.auth.config.client_id

  getServices(fields) {
    const {auth} = this.props;

    return auth.requestToken().
      then(token => auth.getApi(`services/header?fields=${fields}`, token));
  }

  componentDidMount() {
    this.getServices(Services.countFields).then(services => {
      if (!services.length) {
        this.setState({visible: false});
      }
    }).catch(noop);
  }

  renderServices() {
    const {services} = this.state;

    const servicesWithIcons = services.filter(service => service.iconUrl);
    const separatorIsRequired = servicesWithIcons.length !== services.length &&
      servicesWithIcons.length !== 0;

    return (
      <Popup className={styles.services}>
        {servicesWithIcons.sort(Services.sort).map(service => {
          const isActive = this.serviceIsActive(service);

          return (
            <Services.Link
              className={isActive ? styles.activeItem : styles.linkItem}
              isActive={isActive}
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
        {services.filter(service => !service.iconUrl).sort(Services.sort).map(service => {
          const isActive = this.serviceIsActive(service);

          return (
            <Services.Link
              className={isActive ? styles.activeStacked : styles.linkStacked}
              isActive={isActive}
              key={service.id}
              service={service}
            />
          );
        })}
      </Popup>
    );
  }

  render() {
    const {services, visible, loading} = this.state;
    const {className} = this.props;

    const classes = classnames(className, {
      [styles.activeIcon]: loading,
      ['ring-icon_loading']: loading
    });

    if (!visible) {
      return null;
    }

    if (visible && !services) {
      return (
        <TrayIcon
          className={classes}
          glyph={servicesGlyph}
          onClick={this.getServicesContent}
        />
      );
    }

    const anchor = ({active}) => (
      <TrayIcon
        className={classnames({[styles.activeIcon]: active})}
        glyph={servicesGlyph}
      />
    );

    return (
      <Dropdown
        initShown={true}
        anchor={anchor}
        activeClassName={styles.activeIcon}
        className={className}
      >
        {this.renderServices()}
      </Dropdown>
    );
  }
}

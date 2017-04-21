import React from 'react';
import PropTypes from 'prop-types';

import Dropdown from '../../components/dropdown/dropdown';
import PopupMenu from '../../components/popup-menu/popup-menu';
import branches from '../branches.json';
import {currentPath} from '../utils';
import styles from '../index.css';

const HOST = 'http://ring-ui.github.io';

const rgItemType = PopupMenu.ListProps.Type.LINK;

const branchesArr = Object.keys(branches).map(version => ({
  version,
  path: branches[version],
  // /^3\.0\.\d+$/
  versionRE: new RegExp(`^${version.replace(/\./g, '\\.').replace(/\*/g, '\\d+')}$`)
}));

const Version = ({version}) => (
  <Dropdown
    anchor={version}
    className={styles.version}
  >
    <PopupMenu
      data={branchesArr.map(branch => {
        const active = branch.versionRE.test(version);
        return {
          rgItemType,
          active,
          href: `${HOST}${branch.path}${currentPath()}`,
          label: active ? version : branch.version
        };
      })}
      top={-16}
      left={-16}
    />
  </Dropdown>
);

Version.propTypes = {
  version: PropTypes.string
};

export default Version;

import React, {PropTypes} from 'react';

import Dropdown from 'ring-ui/components/dropdown/dropdown';
import PopupMenu from 'ring-ui/components/popup-menu/popup-menu';

import branches from '../branches.json';

const HOST = 'http://ring-ui.github.io';

const rgItemType = PopupMenu.ListProps.Type.LINK;

const branchesArr = Object.keys(branches).map(version => ({
  version,
  path: branches[version],
  // /^3\.0\.\d+$/
  versionRE: new RegExp(`^${version.replace(/\./g, '\\.').replace(/\*/g, '\\d+')}$`)
}));

const Version = ({version, url}) => (
  <Dropdown anchor={version}>
    <PopupMenu
      data={branchesArr.map(branch => {
        const active = branch.versionRE.test(version);
        return {
          rgItemType,
          active,
          href: `${HOST}${branch.path}${url}`,
          label: active ? version : branch.version
        };
      })}
      top={4}
    />
  </Dropdown>
);

Version.propTypes = {
  version: PropTypes.string,
  url: PropTypes.string
};

export default Version;

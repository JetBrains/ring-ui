import DropdownMenu from '../../src/dropdown-menu/dropdown-menu';

import branches from '../branches.json';

import styles from './header-styles.css';

function currentPath() {
  const chunks = window.location.pathname.split(/\//g);
  return chunks[chunks.length - 1];
}

const HOST = 'https://jetbrains.github.io/ring-ui';

const rgItemType = DropdownMenu.ListProps.Type.LINK;

const branchesArr = Object.entries(branches).map(([version, branch]) => ({
  version,
  path: branch,
  // /^0\.1\.\d+$/
  versionRE: new RegExp(`^${version.replace(/\./g, '\\.').replace(/x/g, '\\d+')}$`)
}));

interface VersionProps {
  version: string
}
const Version = ({version}: VersionProps) => (
  <DropdownMenu
    anchor={version}
    className={styles.version}
    data={branchesArr.map(branch => {
      const active = branch.versionRE.test(version);
      return {
        rgItemType,
        active,
        href: `${HOST}/${branch.path}/${currentPath()}`,
        label: active ? version : branch.version
      };
    })}
    menuProps={{
      top: -16, left: -16
    }}
  />
);

export default Version;

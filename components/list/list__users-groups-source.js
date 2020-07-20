import GroupIcon from '@jetbrains/icons/group.svg';

import HubSourceUsersGroups from '../hub-source/hub-source__users-groups';

import List from './list';

const defaultOptions = {
  GroupsTitle: 'Groups',
  NoGroupsTitle: 'No groups',

  UsersTitle: 'Users',
  NoUsersTitle: 'No users',

  getPluralForUserCount: count => {
    // eslint-disable-next-line no-magic-numbers
    const plural = count % 10 !== 1 || count % 100 === 11;
    return `${count} member${plural ? 's' : ''}`;
  }
};

const Filter = {
  ALL: 0,
  USERS: 1,
  GROUPS: 2
};

export default class ListUsersGroupsSource extends HubSourceUsersGroups {
  static Filter = Filter

  constructor(auth, options) {
    super(auth, options);

    this.listSourceOptions = Object.assign({}, defaultOptions, options);
  }

  getGroupsSectionTitle(groups) {
    return groups.length
      ? this.listSourceOptions.GroupsTitle
      : this.listSourceOptions.NoGroupsTitle;
  }

  getUsersSectionTitle(users) {
    return users.length ? this.listSourceOptions.UsersTitle : this.listSourceOptions.NoUsersTitle;
  }

  async getForList(query, filter = Filter.ALL) {
    const [users, groups] = await this.getUserAndGroups(query);
    const items = [];

    if (filter === Filter.ALL) {
      items.push({
        rgItemType: List.ListProps.Type.SEPARATOR,
        key: 2,
        description: this.getUsersSectionTitle(users)
      });
    }

    if (filter !== Filter.GROUPS) {
      users.forEach(user => items.push({
        ...user,
        key: user.id,
        label: user.name,
        avatar: user.profile ? user.profile.avatar.url : null,
        description: user.login
      }));
    }

    if (filter === Filter.ALL) {
      items.push({
        rgItemType: List.ListProps.Type.SEPARATOR,
        key: 1,
        description: this.getGroupsSectionTitle(groups)
      });
    }

    if (filter !== Filter.USERS) {
      groups.forEach(group => items.push({
        ...group,
        key: group.id,
        label: group.name,
        avatar: group.iconUrl,
        glyph: group.iconUrl ? null : GroupIcon,
        description: this.listSourceOptions.getPluralForUserCount(group.userCount)
      }));
    }

    return items;
  }
}

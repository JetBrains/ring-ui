import GroupIcon from '@jetbrains/icons/group';

import Auth, {AuthUser} from '../auth/auth';
import HubSourceUsersGroups, {HubSourceUsersGroupsOptions, UserGroup} from '../hub-source/hub-source__users-groups';

import List from './list';

interface ListUsersGroupsSourceOptions extends Partial<HubSourceUsersGroupsOptions> {
  GroupsTitle: string;
  NoGroupsTitle: string;
  UsersTitle: string;
  NoUsersTitle: string;
  getPluralForUserCount: (count: number) => string;
}

const defaultOptions: ListUsersGroupsSourceOptions = {
  GroupsTitle: 'Groups',
  NoGroupsTitle: 'No groups',

  UsersTitle: 'Users',
  NoUsersTitle: 'No users',

  getPluralForUserCount: count => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const plural = count % 10 !== 1 || count % 100 === 11;
    return `${count} member${plural ? 's' : ''}`;
  },
};

enum Filter {
  ALL = 0,
  USERS = 1,
  GROUPS = 2,
}

export default class ListUsersGroupsSource extends HubSourceUsersGroups {
  static Filter = Filter;
  listSourceOptions: ListUsersGroupsSourceOptions;

  constructor(auth: Auth, options?: Partial<ListUsersGroupsSourceOptions>) {
    super(auth, options);

    this.listSourceOptions = Object.assign({}, defaultOptions, options);
  }

  getGroupsSectionTitle(groups: UserGroup[]) {
    return groups.length ? this.listSourceOptions.GroupsTitle : this.listSourceOptions.NoGroupsTitle;
  }

  getUsersSectionTitle(users: AuthUser[]) {
    return users.length ? this.listSourceOptions.UsersTitle : this.listSourceOptions.NoUsersTitle;
  }

  async getForList(query?: string, filter = Filter.ALL) {
    const [users, groups] = await this.getUserAndGroups(query);
    const items = [];

    if (filter === Filter.ALL) {
      items.push({
        rgItemType: List.ListProps.Type.SEPARATOR,
        key: 2,
        description: this.getUsersSectionTitle(users),
      });
    }

    if (filter !== Filter.GROUPS) {
      users.forEach(user =>
        items.push({
          ...user,
          key: user.id,
          label: user.name,
          avatar: user.profile ? user.profile.avatar?.url : null,
          description: user.login,
        }),
      );
    }

    if (filter === Filter.ALL) {
      items.push({
        rgItemType: List.ListProps.Type.SEPARATOR,
        key: 1,
        description: this.getGroupsSectionTitle(groups),
      });
    }

    if (filter !== Filter.USERS) {
      groups.forEach(group =>
        items.push({
          ...group,
          key: group.id,
          label: group.name,
          avatar: group.iconUrl,
          glyph: group.iconUrl ? null : GroupIcon,
          description: this.listSourceOptions.getPluralForUserCount(group.userCount),
        }),
      );
    }

    return items;
  }
}

import List from '../list/list';
import HubSourceUsersGroups from '../hub-source/hub-source__users-groups';

const defaultOptions = {
  GroupsTitle: 'Groups',
  NoGroupsTitle: 'No groups',

  UsersTitle: 'Users',
  NoUsersTitle: 'No users',

  getPluralForUserCount: () => ''
};

export default class ListUsersGroupsSource extends HubSourceUsersGroups {
  constructor(auth, options) {
    super(auth, options);

    this.listSourceOptions = Object.assign({}, defaultOptions, options);
  }

  getGroupsSectionTitle(groups) {
    return groups.length ? this.listSourceOptions.GroupsTitle : this.listSourceOptions.NoGroupsTitle;
  }

  getUsersSectionTitle(users) {
    return users.length ? this.listSourceOptions.UsersTitle : this.listSourceOptions.NoUsersTitle;
  }

  async getForList(query) {
    const [users, groups] = await this.getUserAndGroups(query);
    const groupsTitle = {
      rgItemType: List.ListProps.Type.SEPARATOR,
      key: 1,
      description: this.getGroupsSectionTitle(groups)
    };

    const groupsForList = groups.map(group => Object.assign(group, {
      key: group.id,
      label: group.name,
      description: this.listSourceOptions.getPluralForUserCount(group.userCount)
    }));

    const usersTitle = {
      rgItemType: List.ListProps.Type.SEPARATOR,
      key: 2,
      description: this.getUsersSectionTitle(users)
    };

    const usersForList = users.map(user => Object.assign(user, {
      key: user.id,
      label: user.name,
      icon: user.profile ? user.profile.avatar.url : null,
      description: user.login
    }));

    return [groupsTitle, ...groupsForList, usersTitle, ...usersForList];
  }
}

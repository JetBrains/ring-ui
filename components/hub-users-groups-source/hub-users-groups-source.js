import List from 'list/list';

const SEARCH_MAX = 42;

let defaultOptions =  {
  GroupsTitle: 'Groups',
  UsersTitle: 'Users',
  getPluralForUserCount: count => ''
};

export default class HubUsersGroupsSource {
  constructor(Auth, options) {
    this.Auth = Auth;
    this.options = Object.assign({}, defaultOptions, options);
  }

  makeRequest(relativeUrl, params) {
    return this.Auth.requestToken()
      .then(token => this.Auth.getApi(relativeUrl, token, params));
  }

  getUsers(filter) {
    return this.makeRequest('users', {
      query: filter ? `nameStartsWith: ${filter} or loginStartsWith: ${filter}` : '',
      fields: 'id,name,login,avatar/url',
      orderBy: 'name',
      $top: SEARCH_MAX
    })
      .then(response => response.users || [])
  }

  getGroups(filter) {
    return this.makeRequest('usergroups', {
      query: filter ? `${filter}* or ${filter}` : '',
      fields: 'id,name,userCount',
      orderBy: 'name',
      $top: SEARCH_MAX
    })
      .then(response => response.usergroups || [])
  }

  getUserAndGroups(filter) {
    return Promise.all([this.getUsers(filter), this.getGroups(filter)]);
  }

  getForList(filter) {
    return this.getUserAndGroups(filter)
      .then(([users, groups]) => {
        let usersAndGroups = [{
          rgItemType: List.ListProps.Type.SEPARATOR,
          key: 1,
          description: this.options.GroupsTitle
        }];

        usersAndGroups = usersAndGroups.concat(groups.map(group => {
          return Object.assign(group, {
            key: group.id,
            label: group.name,
            description: this.options.getPluralForUserCount(group.userCount)
          });
        }));

        usersAndGroups.push({
          rgItemType: List.ListProps.Type.SEPARATOR,
          key: 2,
          description: this.options.UsersTitle
        });

        usersAndGroups = usersAndGroups.concat(users
          .map((user) => {
            return Object.assign(user, {
              key: user.id,
              label: user.name,
              icon: user.avatar.url,
              description: user.login
            });
          }));

        return usersAndGroups;
      });
  }
}

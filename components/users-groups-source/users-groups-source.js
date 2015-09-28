import List from 'list/list';

const SEARCH_MAX = 42;

export default class UsersGroupsSource {
  constructor(Auth) {
    this.Auth = Auth;
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
          description: 'Groups'
        }];

        usersAndGroups = usersAndGroups.concat(groups.map(group => {
          group.key = group.id;
          group.label = group.name;
          group.description = `${group.userCount} users`;
          return group;
        }));

        usersAndGroups.push({
          rgItemType: List.ListProps.Type.SEPARATOR,
          key: 2,
          description: 'Users'
        });

        usersAndGroups = usersAndGroups.concat(users
          .map((user) => {
            user.label = user.name;
            user.isUser = true;
            user.icon = user.avatar.url;
            user.description = user.login;
            return user;
          }));

        return usersAndGroups;
      });
  }
}

import HubSource from 'hub-source/hub-source';

let defaultOptions =  {
  GroupsTitle: 'Groups',
  UsersTitle: 'Users',
  getPluralForUserCount: count => '',
  searchMax: 20,
  searchSideThreshold: 200
};

export default class HubUsersGroupsSource {
  constructor(auth, options) {
    this.auth = auth;
    this.options = Object.assign({}, defaultOptions, options);

    this.usersSource = new HubSource(auth, 'users', {
      searchMax: this.options.searchMax,
      searchSideThreshold: 100,
      queryFormatter: (query) => `nameStartsWith: ${query} or loginStartsWith: ${query}`
    });
    this.groupsSource = new HubSource(auth, 'usergroups', {
      searchMax: this.options.searchMax,
      searchSideThreshold: 100
    });
  }

  getUsers(query = '') {
    return this.usersSource.get(query, {
      fields: 'id,name,login,total,profile/avatar/url',
      orderBy: 'name'
    });
  }

  getGroups(query = '') {
    return this.groupsSource.get(query, {
      fields: 'id,name,total,userCount',
      orderBy: 'name'
    });
  }

  getUserAndGroups(query) {
    return Promise.all([this.getUsers(query), this.getGroups(query)]);
  }
}

import HubSource from 'hub-source/hub-source';

let defaultOptions =  {
  GroupsTitle: 'Groups',
  UsersTitle: 'Users',
  getPluralForUserCount: count => '',
  searchMax: 20,
  cacheExpireTime: 60/*sec*/ * 1000,
  searchSideThreshold: 200
};

export default class HubUsersGroupsSource {
  constructor(auth, options) {
    this.auth = auth;
    this.options = Object.assign({}, defaultOptions, options);

    this.usersSource = new HubSource(auth, 'users', this.options);
    this.groupsSource = new HubSource(auth, 'usergroups', this.options);
  }

  static prepareQuery(query) {
    if (query && query.indexOf(' ') !== -1) {
      return '{' + query + '}'
    }
    return query;
  }

  getUsers(query = '') {
    query = HubUsersGroupsSource.prepareQuery(query);

    return this.usersSource.get(query, {
      query: query ? `nameStartsWith: ${query} or loginStartsWith: ${query}` : '',
      fields: 'id,name,login,total,profile/avatar/url',
      orderBy: 'name'
    });
  }

  getGroups(query = '') {
    return this.groupsSource.get(query, {
      query: query ? `${query} or ${query}*` : '',
      fields: 'id,name,total,userCount',
      orderBy: 'name'
    });
  }

  getUserAndGroups(query) {
    return Promise.all([this.getUsers(query), this.getGroups(query)]);
  }
}

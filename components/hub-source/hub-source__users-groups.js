import HubSource from './hub-source';

const defaultOptions = {
  searchMax: 20,
  searchSideThreshold: 200
};

export default class HubSourceUsersGroups {
  constructor(auth, options) {
    this.auth = auth;
    this.options = Object.assign({}, defaultOptions, options);

    this.usersSource = new HubSource(auth, 'users', {
      searchMax: this.options.searchMax,
      searchSideThreshold: this.options.searchSideThreshold,
      queryFormatter: query => `nameStartsWith: ${HubSourceUsersGroups.wrapMultiwordQuery(query)} or loginStartsWith: ${HubSourceUsersGroups.wrapMultiwordQuery(query)}`
    });
    this.groupsSource = new HubSource(auth, 'usergroups', {
      searchMax: this.options.searchMax,
      searchSideThreshold: this.options.searchSideThreshold
    });
  }

  static wrapMultiwordQuery(query) {
    if (query && query.indexOf(' ') !== -1) {
      return `{${query}}`;
    }
    return query;
  }

  createUsersFilterFn(query) {
    if (!query) {
      return () => true;
    }
    const normalizedQuery = query.toLowerCase();

    return it => (
      it.name.toLowerCase().indexOf(normalizedQuery) !== -1 ||
      it.login.toLowerCase().indexOf(normalizedQuery) !== -1
    );
  }

  getUsers(query = '') {
    return this.usersSource.get(query, {
      fields: 'id,name,login,total,profile/avatar/url',
      orderBy: 'name'
    }, this.createUsersFilterFn(query));
  }

  getGroups(query = '') {
    return this.groupsSource.get(query, {
      fields: 'id,name,total,userCount,iconUrl',
      orderBy: 'name'
    });
  }

  getUserAndGroups(query) {
    return Promise.all([this.getUsers(query), this.getGroups(query)]);
  }
}

import HubSource, {type Item} from './hub-source';

import type Auth from '../auth/auth';
import type {AuthUser} from '../auth/auth';

export interface HubSourceUsersGroupsOptions {
  searchMax: number;
  searchSideThreshold: number;
}

const defaultOptions: HubSourceUsersGroupsOptions = {
  searchMax: 20,
  searchSideThreshold: 200,
};

export interface UserGroup extends Item {
  id: string;
  total?: number;
  userCount: number;
  iconUrl?: string;
}

export default class HubSourceUsersGroups {
  auth: Auth;
  options: HubSourceUsersGroupsOptions;
  usersSource: HubSource<AuthUser, 'users'>;
  groupsSource: HubSource<UserGroup, 'usergroups'>;
  constructor(auth: Auth, options?: Partial<HubSourceUsersGroupsOptions>) {
    this.auth = auth;
    this.options = Object.assign({}, defaultOptions, options);

    this.usersSource = new HubSource(auth, 'users', {
      searchMax: this.options.searchMax,
      searchSideThreshold: this.options.searchSideThreshold,
      queryFormatter: query =>
        `nameStartsWith: ${HubSourceUsersGroups.wrapMultiwordQuery(query)} or loginStartsWith: ${HubSourceUsersGroups.wrapMultiwordQuery(query)}`,
    });
    this.groupsSource = new HubSource(auth, 'usergroups', {
      searchMax: this.options.searchMax,
      searchSideThreshold: this.options.searchSideThreshold,
    });
  }

  static wrapMultiwordQuery(query?: string) {
    if (query && query.indexOf(' ') !== -1) {
      return `{${query}}`;
    }
    return query;
  }

  createUsersFilterFn(query?: string) {
    if (!query) {
      return () => true;
    }
    const normalizedQuery = query.toLowerCase();

    return (it: AuthUser) =>
      it.name.toLowerCase().indexOf(normalizedQuery) !== -1 || it.login.toLowerCase().indexOf(normalizedQuery) !== -1;
  }

  getUsers(query = '') {
    return this.usersSource.get(
      query,
      {
        fields: 'id,name,login,total,profile/avatar/url',
        orderBy: 'name',
      },
      this.createUsersFilterFn(query),
    );
  }

  getGroups(query = '') {
    return this.groupsSource.get(query, {
      fields: 'id,name,total,userCount,iconUrl',
      orderBy: 'name',
    });
  }

  getUserAndGroups(query?: string) {
    return Promise.all([this.getUsers(query), this.getGroups(query)]);
  }
}

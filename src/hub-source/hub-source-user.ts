import HTTP from '../http/http';
import {type UserCardUser} from '../user-card/card';

import type {AuthUser} from '../auth/auth';
import type Auth from '../auth/auth';

const DEFAULT_FIELDS = 'id,name,login,banned,banReason,profile(email/email,avatar/url)';

export function convertUserForCard(hubUser: AuthUser, serverUri = ''): UserCardUser {
  return {
    name: hubUser.name,
    login: hubUser.login,
    banned: hubUser.banned,
    banReason: hubUser.banReason,
    email: hubUser.profile?.email?.email,
    avatarUrl: hubUser.profile?.avatar?.url,
    href: `${serverUri}users/${hubUser.id}`,
  };
}

export function createHubUserCardSource(auth: Auth, userId: string | number, fields = DEFAULT_FIELDS) {
  const http = new HTTP(auth);

  return async function getHubUser() {
    const hubUser = await http.get<AuthUser>(`${auth.config.serverUri}api/rest/users/${userId}?fields=${fields}`);

    return convertUserForCard(hubUser, auth.config.serverUri);
  };
}

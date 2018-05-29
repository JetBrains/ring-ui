import HTTP from '../http/http';

const DEFAULT_FIELDS = 'id,name,login,banned,banReason,profile(email/email,avatar/url)';

export function convertUserForCard(hubUser, serverUri = '') {
  return {
    name: hubUser.name,
    login: hubUser.login,
    banned: hubUser.banned,
    banReason: hubUser.banReason,
    email: hubUser.profile.email && hubUser.profile.email.email,
    avatarUrl: hubUser.profile.avatar.url,
    href: `${serverUri}users/${hubUser.id}`
  };
}

export function createHubUserCardSource(auth, userId, fields = DEFAULT_FIELDS) {
  const http = new HTTP(auth);

  return async function getHubUser() {
    const hubUser = await http.get(
      `${auth.config.serverUri}api/rest/users/${userId}?fields=${fields}`
    );

    return convertUserForCard(hubUser, auth.config.serverUri);
  };
}

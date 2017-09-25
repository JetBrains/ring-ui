import HTTP from '../http/http';

const DEFAULT_FIELDS = 'id,name,login,profile(email/email,avatar/url)';

export function createHubUserCardSource(auth, userId, fields = DEFAULT_FIELDS) {
  const http = new HTTP(auth);

  return async function getHubUser() {
    const hubUser = await http.get(
      `${auth.config.serverUri}api/rest/users/${userId}?fields=${fields}`
    );

    return {
      name: hubUser.name,
      login: hubUser.login,
      email: hubUser.profile.email && hubUser.profile.email.email,
      avatarUrl: hubUser.profile.avatar.url,
      href: `${auth.config.serverUri}users/${hubUser.id}`
    };
  };
}

# JT-93843 Token Refresh Coordination

## Summary

Multiple YouTrack tabs can refresh an access token at the same time after inactivity, sleep, or network recovery. Each silent iframe refresh can supersede the token written by another tab. A tab that receives an already-superseded token then gets a 401 and may show an auth dialog or log the user out until the page is refreshed.

Ring UI coordinates silent token refresh with the Web Locks API and reuses a fresh token written by another tab instead of minting another one.

## Goals

- Serialize silent token refresh across tabs and same-page Ring UI clients that share the same `clientId`.
- Reuse a locally valid stored token when it differs from the token that failed or from the pre-refresh storage snapshot.
- Still force a real refresh when the stored token is unchanged, because that token can be locally valid yet server-rejected.
- Keep interactive dialog and redirect handling outside the Web Lock callback.
- Retry passive `_detectUserChange` user loading once after a 401 without invoking the interactive refresh fallback.

## Non-goals

- Track all rejected tokens.
- Add a custom cross-tab locking implementation for browsers without Web Locks.

## Design

`HTTP.request()` keeps the token used for the failed request and passes it to `forceTokenUpdate(failedToken)`. That token is the comparison baseline. If another tab has already written a different locally valid token, Ring UI reuses it. If storage still contains the same token, Ring UI refreshes through Hub.

When no rejected token is known, `forceTokenUpdate()` snapshots the stored token before the backend status check. This keeps a sibling refresh that happens during the backend check visible as a changed token.

Silent refresh runs under a Web Lock named by `clientId`. The lock callback normalizes refresh results into either a token result or an error result. Dialog and redirect fallback are handled after the lock is released.

Lock acquisition is bounded by `TOKEN_REFRESH_LOCK_TIMEOUT`. If the Web Locks API is unavailable, lock acquisition times out, or lock acquisition rejects, the tab falls back to the previous unsynchronized refresh behavior.

`_detectUserChange()` uses the access token from the storage event as the rejected-token baseline when `getUser()` returns 401. On refresh failure, it rethrows the original 401 so the passive storage-event path does not run the interactive force-refresh fallback.

## Rejected Alternatives

### Store the last issued token in `Auth`

One mutable `lastIssuedToken` is not per request. A later request in the same tab can overwrite it before an earlier request handles its 401, causing the earlier request to compare against the fresh stored token and mint another token.

### Store all rejected token hashes

This adds state and cleanup rules without removing the need to know which token failed. The per-request rejected token is already available in `HTTP.request()`.

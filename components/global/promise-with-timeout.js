// Useful for using fetch with timeout
// https://github.com/github/fetch/issues/175#issuecomment-284787564

export default function promiseWithTimeout(promise, timeout, {error}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(error || new Error('Timeout')), timeout);

    promise.then(resolve, reject);
  });
}

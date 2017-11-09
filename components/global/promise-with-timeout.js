// Useful for using fetch with timeout
// https://github.com/github/fetch/issues/175#issuecomment-284787564

export default function promiseWithTimeout(promise, timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('timeout')), timeout);

    promise.then(resolve, reject);
  });
}

// Useful for using fetch with timeout
// https://github.com/github/fetch/issues/175#issuecomment-284787564

export interface PromiseWithTimeoutConfig {
  error?: Error | null | undefined
}

export default function promiseWithTimeout<T>(
  promise: Promise<T>,
  timeout: number,
  {error}: PromiseWithTimeoutConfig
) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(error || new Error('Timeout')), timeout);

    promise.then(resolve, reject);
  });
}

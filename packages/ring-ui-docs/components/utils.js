import 'whatwg-fetch';

export function currentPath() {
  const chunks = window.location.pathname.split(/\//g);
  return chunks[chunks.length - 1];
}

export function fetchData(url) {
  return fetch(url).then(res => res.json());
}

export function fetchNavData() {
  return fetchData('nav.json');
}

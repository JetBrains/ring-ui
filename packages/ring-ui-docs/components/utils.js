export function currentPath() {
  const chunks = window.location.pathname.split(/\//g);
  return chunks[chunks.length - 1];
}

export function getDocs() {
  return window.navData.categories.find(({name}) => name === 'Docs');
}

export function getIndexDoc() {
  return getDocs().items.find(({order}) => order === 0).url;
}

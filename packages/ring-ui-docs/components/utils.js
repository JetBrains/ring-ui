export function currentPath() {
  const chunks = window.location.pathname.split(/\//g);
  return chunks[chunks.length - 1];
}

export function getIndexDoc(docs) {
  return docs.find(({order}) => order === 0).url;
}

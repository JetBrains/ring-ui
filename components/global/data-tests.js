
function expandMap(attrsMap) {
  return Object.entries(attrsMap).
    reduce((result, [key, value]) => (value ? [...result, key] : result), []);
}

export default function joinDataTestAttributes(...attrs) {
  return attrs.
    filter(attr => !!attr).
    reduce((result, attr) => {
      if (typeof attr === 'object') {
        return [...result, ...expandMap(attr)];
      }
      return [...result, attr];
    }, []).
    join(' ');
}

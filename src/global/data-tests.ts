type AttrsMap = Record<string, boolean | null | undefined>;

function expandMap(attrsMap: AttrsMap) {
  return Object.entries(attrsMap).reduce<string[]>((result, [key, value]) => (value ? [...result, key] : result), []);
}

export default function joinDataTestAttributes(...attrs: Array<string | AttrsMap | null | undefined>) {
  return attrs
    .reduce<string[]>((result, attr) => {
      if (!attr) {
        return result;
      }
      if (typeof attr === 'object') {
        return [...result, ...expandMap(attr)];
      }
      return [...result, attr];
    }, [])
    .join(' ');
}

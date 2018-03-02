export default function joinDataTestAttributes(...attrs) {
  return attrs.
    filter(attr => !!attr).
    join(' ');
}

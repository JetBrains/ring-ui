const idCounters = {};

export default function getUID(name) {
  if (!name) {
    throw Error('Argument "name" is required in getUID()');
  }

  if (!idCounters[name]) {
    idCounters[name] = 0;
  }

  const id = String(idCounters[name]++);

  // The "new" prefix is a temporary hack that should be removed when ring-component will be gone
  return `new-${name}${id}`;
}

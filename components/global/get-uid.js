const idCounters = {};

export default function getUID(name) {
  if (!name) {
    throw Error('Parameter name is required in getUID()');
  }

  if (!idCounters[name]) {
    idCounters[name] = 0;
  }

  const id = String(idCounters[name]++);

  // The "new" prefix is temporary, should be deleted when ring-component will be gone
  return `new-${name}${id}`;
}

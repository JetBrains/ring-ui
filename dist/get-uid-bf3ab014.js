var idCounters = {};
function getUID(name) {
  if (!name) {
    throw Error('Argument "name" is required in getUID()');
  }

  if (!idCounters[name]) {
    idCounters[name] = 0;
  }

  var id = String(idCounters[name]++);
  return name + id;
}

export { getUID as g };

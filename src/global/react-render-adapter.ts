import deprecate from 'util-deprecate';

// TODO remove in 7.0
export const setClient = deprecate(() => {}, 'setClient does nothing in Ring UI 6.0 and will be removed in 7.0');

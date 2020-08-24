const compose = (...funcs) =>
  funcs.reduce((acc, func) => arg => acc(func(arg)), arg => arg);

export default compose;

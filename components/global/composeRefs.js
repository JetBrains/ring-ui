export default (...refs) => value => refs.forEach(ref => {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref != null) {
    ref.current = value;
  }
});

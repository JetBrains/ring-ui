import memoize from './memoize';

export default memoize(declaration => {
  const [property, value] = declaration.split(': ');
  const camelCaseProperty = property.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
  const div = document.createElement('div');
  if (div.style[camelCaseProperty] === undefined) {
    return false;
  }

  if (value) {
    div.style[camelCaseProperty] = value;
    return Boolean(div.style[camelCaseProperty]);
  }

  return true;
});

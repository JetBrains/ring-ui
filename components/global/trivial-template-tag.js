const TWO = 2;

export default function trivialTemplateTag(f) {
  return (strings, ...interpolations) => {
    const chunks = [...strings];
    // insert the interpolations where they belong to
    interpolations.forEach((value, i) =>
      chunks.splice(TWO * i + 1, 0, value));
    return f(chunks.join(''));
  };
}

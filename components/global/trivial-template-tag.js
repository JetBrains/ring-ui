const TWO = 2;

export default function trivialTemplateTag(f) {
  return (strings, ...interpolations) => {
    // insert the interpolations where they belong to
    interpolations.forEach((value, i) =>
      strings.splice(TWO * i + 1, value));
    return f(strings.join());
  };
}

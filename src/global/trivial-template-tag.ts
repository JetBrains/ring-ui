const TWO = 2;

export default function trivialTemplateTag(f: (string: string) => void) {
  return (strings: TemplateStringsArray, ...interpolations: unknown[]) => {
    const chunks: unknown[] = [...strings];
    // insert the interpolations where they belong to
    interpolations.forEach((value, i) => chunks.splice(TWO * i + 1, 0, value));
    return f(chunks.join(''));
  };
}

declare module '*.css' {
  const styles: Record<string, string>;
  export default styles;
}

declare module '@jetbrains/icons/*' {
  declare const source: string;
  export = source;
}

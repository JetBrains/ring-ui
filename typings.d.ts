declare module '*.css' {
  const styles: Record<string, string>;
  export default styles;
}

declare module '*.svg' {
  const source: string;
  export default source;
}

declare module 'simply-uuid' {
  export function generate(): string;
}

declare module 'highlight.js/lib/core.js' {
  import hljs from 'highlight.js';

  export default hljs;
}

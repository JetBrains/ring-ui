declare module '*.css' {
  const styles: Record<string, string>;
  export default styles;
}

declare module '*.svg' {
  const source: string;
  export default source;
}
declare module '*.md' {
  const source: string;
  export default source;
}
declare module '*.txt' {
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

declare module 'combokeys/test/lib/key-event' {
  export function simulate(
    charCode: number,
    keyCode: number,
    modifiers?: ('shift' | 'ctrl' | 'alt' | 'meta')[],
    element?: Element,
    repeat?: number
  ): void;
}

declare module 'scrollbar-width' {
  export default function getScrollbarWidth(
    recalculate?: boolean
  ): number | null;
}

declare module 'sniffr' {
  enum Browser {
    FIREFOX = 'firefox',
    CHROME = 'chrome',
    IE = 'ie',
    SAFARI = 'safari',
    EDGE = 'edge',
    ANDROID = 'com.android.browser',
    OPERA = 'opera',
    OPERA_MINI = 'opera.mini',
    BLACKBERRY = 'blackberry',
    ICEWEASEL = 'iceweasel',
  }

  enum OS {
    LINUX = 'linux',
    MACOS = 'macos',
    WINDOWS = 'windows',
    IOS = 'ios',
    OPENBSD = 'openbsd',
    ANDROID = 'android',
    FIREFOXOS = 'firefoxos',
    WINDOWS_PHONE = 'windows.phone',
    WINDOWS_MOBILE = 'windows.mobile',
    BLACKBERRYOS = 'blackberryos',
  }

  enum Device {
    IPAD = 'ipad',
    IPHONE = 'iphone',
    LUMIA = 'lumia',
    HTC = 'htc',
    NEXUS = 'nexus',
    GALAXY_NEXUS = 'galaxy.nexus',
    NOKIA = 'nokia',
    GALAXY = 'galaxy',
    XBOX = 'xbox',
    BLACKBERRY = 'blackberry',
  }

  export interface SnifferProperty<T extends string> {
    name: T | 'Unknown'
    version: number[]
    versionString: string
  }

  export default class Sniffer {
    os: SnifferProperty<OS>;
    device: SnifferProperty<Device>;
    browser: SnifferProperty<Browser>;
    sniff(userAgentString?: string): this
  }
}

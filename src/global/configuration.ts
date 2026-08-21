export enum ControlsHeight {
  S = 'S',
  M = 'M',
  L = 'L',
}

export interface RingUITrustedTypePolicy {
  createHTML(html: string): TrustedHTML;
}

export interface RingUIConfiguration {
  controlsHeight?: ControlsHeight;
  popupsCssPositioning?: boolean;
  trustedTypePolicy?: RingUITrustedTypePolicy | null;
}

const globalConfiguration: Required<RingUIConfiguration> = {
  controlsHeight: ControlsHeight.M,
  popupsCssPositioning: true,
  trustedTypePolicy: null,
};

export function configure(config: RingUIConfiguration): void {
  if (config.controlsHeight !== undefined) {
    globalConfiguration.controlsHeight = config.controlsHeight;
  }
  if (config.popupsCssPositioning !== undefined) {
    globalConfiguration.popupsCssPositioning = config.popupsCssPositioning;
  }
  if (config.trustedTypePolicy !== undefined) {
    globalConfiguration.trustedTypePolicy = config.trustedTypePolicy;
  }
}

export function getConfiguration(): Required<RingUIConfiguration> {
  return {...globalConfiguration};
}

export function getTrustedHTML(html: string): string | TrustedHTML {
  return globalConfiguration.trustedTypePolicy?.createHTML(html) ?? html;
}

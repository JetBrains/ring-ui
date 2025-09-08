export enum ControlsHeight {
  S = 'S',
  M = 'M',
  L = 'L',
}

export interface RingUIConfiguration {
  controlsHeight?: ControlsHeight;
  popupsCssPositioning?: boolean;
}

const globalConfiguration: Required<RingUIConfiguration> = {
  controlsHeight: ControlsHeight.M,
  popupsCssPositioning: true,
};

export function configure(config: RingUIConfiguration): void {
  if (config.controlsHeight !== undefined) {
    globalConfiguration.controlsHeight = config.controlsHeight;
  }
  if (config.popupsCssPositioning !== undefined) {
    globalConfiguration.popupsCssPositioning = config.popupsCssPositioning;
  }
}

export function getConfiguration(): Required<RingUIConfiguration> {
  return {...globalConfiguration};
}

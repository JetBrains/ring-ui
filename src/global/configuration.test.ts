import {configure, getConfiguration, ControlsHeight} from './configuration';
import {getGlobalControlsHeight} from './controls-height';

describe('Ring UI Configuration', () => {
  it('should configure controls height', () => {
    configure({
      controlsHeight: ControlsHeight.L,
    });

    expect(getConfiguration().controlsHeight).toBe(ControlsHeight.L);
    expect(getGlobalControlsHeight()).toBe(ControlsHeight.L);
  });

  it('should configure popups CSS positioning', () => {
    configure({
      popupsCssPositioning: false,
    });

    expect(getConfiguration().popupsCssPositioning).toBe(false);
  });

  it('should configure multiple options at once', () => {
    configure({
      controlsHeight: ControlsHeight.S,
      popupsCssPositioning: true,
    });

    const config = getConfiguration();
    expect(config.controlsHeight).toBe(ControlsHeight.S);
    expect(config.popupsCssPositioning).toBe(true);
    expect(getGlobalControlsHeight()).toBe(ControlsHeight.S);
  });

  it('should maintain default values for unconfigured options', () => {
    configure({
      controlsHeight: ControlsHeight.L,
    });

    const config = getConfiguration();
    expect(config.controlsHeight).toBe(ControlsHeight.L);
    expect(config.popupsCssPositioning).toBe(true); // default value should be maintained
  });
});

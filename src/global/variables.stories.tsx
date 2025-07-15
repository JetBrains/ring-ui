import {useEffect, useRef, useState, useSyncExternalStore} from 'react';

import {GLOBAL_DARK_CLASS_NAME} from './theme';

export default {
  title: 'Style-only/Theme palette',

  parameters: {
    notes: `
Ring UI colors are based on CSS custom properties spec. You can use them in you markup directly.
    `,
  },
};

const formatColorPropertyValue = (value: string) => {
  if (value.indexOf('RGB(') > -1 && value.indexOf(')') > 0) {
    const rgbComponents = value
      .substring(value.indexOf('RGB(') + 'RGB('.length, value.indexOf(')'))
      .split(',')
      .map(it => {
        try {
          return Number.parseInt(it.trim(), 10);
        } catch (err) {
          return 0;
        }
      })
      .map(it => it.toString(16))
      .map(it => (it.length === 1 ? `0${it}` : it))
      .join('')
      .toUpperCase();
    return `#${rgbComponents} - ${value}`;
  }
  return value;
};

type ColorItemProps = {
  propName: string;
};
function ColorItem({propName}: ColorItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [colorValue, setColorValue] = useState<string>();
  const isDarkTheme = useSyncExternalStore(
    onStoreChange => {
      const observer = new MutationObserver(onStoreChange);
      observer.observe(document.documentElement, {attributeFilter: ['class']});
      observer.observe(document.body, {attributeFilter: ['class']});
      return () => observer.disconnect();
    },
    () =>
      document.documentElement.classList.contains(GLOBAL_DARK_CLASS_NAME) ||
      document.body.classList.contains(GLOBAL_DARK_CLASS_NAME),
  );
  useEffect(() => {
    if (ref.current != null) {
      const value = getComputedStyle(ref.current).getPropertyValue(propName).toUpperCase();
      setColorValue(formatColorPropertyValue(value));
    }
  }, [propName, isDarkTheme]);
  return (
    <div className="color-item">
      <div className="color-square" style={{backgroundColor: `var(${propName})`}} />
      <div className="color-info">
        <div>{propName}</div>
        <div className="color-value" ref={ref}>
          {colorValue}
        </div>
      </div>
    </div>
  );
}

const renderColors = () => (
  <div className="container">
    <h3>Element colors:</h3>
    <div className="colors-group">
      <ColorItem propName="--ring-line-color" />
      <ColorItem propName="--ring-borders-color" />
      <ColorItem propName="--ring-icon-color" />
      <ColorItem propName="--ring-icon-white-color" />
      <ColorItem propName="--ring-icon-secondary-color" />
      <ColorItem propName="--ring-border-disabled-color" />
      <ColorItem propName="--ring-border-selected-disabled-color" />
      <ColorItem propName="--ring-border-disabled-active-color" />
      <ColorItem propName="--ring-icon-disabled-color" />
      <ColorItem propName="--ring-border-hover-color" />
      <ColorItem propName="--ring-border-hover-success-color" />
      <ColorItem propName="--ring-border-hover-error-color" />
      <ColorItem propName="--ring-border-accent-color" />
      <ColorItem propName="--ring-icon-hover-color" />
      <ColorItem propName="--ring-main-color" />
      <ColorItem propName="--ring-action-link-color" />
      <ColorItem propName="--ring-main-hover-color" />
      <ColorItem propName="--ring-main-success-color" />
      <ColorItem propName="--ring-main-success-hover-color" />
      <ColorItem propName="--ring-main-error-color" />
      <ColorItem propName="--ring-main-error-hover-color" />
      <ColorItem propName="--ring-main-warning-color" />
      <ColorItem propName="--ring-main-warning-hover-color" />
      <ColorItem propName="--ring-icon-error-color" />
      <ColorItem propName="--ring-icon-warning-color" />
      <ColorItem propName="--ring-icon-success-color" />
      <ColorItem propName="--ring-icon-highlight-color" />
      <ColorItem propName="--ring-icon-highlight-hover-color" />
      <ColorItem propName="--ring-success-border-color" />
      <ColorItem propName="--ring-success-border-hover-color" />
      <ColorItem propName="--ring-error-border-color" />
      <ColorItem propName="--ring-error-border-hover-color" />
      <ColorItem propName="--ring-warning-border-color" />
      <ColorItem propName="--ring-warning-border-hover-color" />
      <ColorItem propName="--ring-highlight-border-color" />
      <ColorItem propName="--ring-highlight-border-hover-color" />
      <ColorItem propName="--ring-pale-control-color" />
      <ColorItem propName="--ring-popup-border-color" />
      <ColorItem propName="--ring-popup-shadow-color" />
      <ColorItem propName="--ring-popup-secondary-shadow-color" />
      <ColorItem propName="--ring-message-shadow-color" />
      <ColorItem propName="--ring-pinned-shadow-color" />
      <ColorItem propName="--ring-button-danger-hover-color" />
      <ColorItem propName="--ring-button-primary-border-color" />
    </div>

    <h3>Text colors:</h3>
    <div className="colors-group">
      <ColorItem propName="--ring-search-color" />
      <ColorItem propName="--ring-hint-color" />
      <ColorItem propName="--ring-link-color" />
      <ColorItem propName="--ring-link-hover-color" />
      <ColorItem propName="--ring-error-color" />
      <ColorItem propName="--ring-warning-color" />
      <ColorItem propName="--ring-success-color" />
      <ColorItem propName="--ring-text-color" />
      <ColorItem propName="--ring-active-text-color" />
      <ColorItem propName="--ring-white-text-color" />
      <ColorItem propName="--ring-heading-color" />
      <ColorItem propName="--ring-secondary-color" />
      <ColorItem propName="--ring-disabled-color" />
    </div>

    <h3>Background colors:</h3>
    <div className="colors-group">
      <ColorItem propName="--ring-content-background-color" />
      <ColorItem propName="--ring-popup-background-color" />
      <ColorItem propName="--ring-sidebar-background-color" />
      <ColorItem propName="--ring-secondary-background-color" />
      <ColorItem propName="--ring-selected-background-color" />
      <ColorItem propName="--ring-hover-background-color" />
      <ColorItem propName="--ring-navigation-background-color" />
      <ColorItem propName="--ring-tag-background-color" />
      <ColorItem propName="--ring-tag-hover-background-color" />
      <ColorItem propName="--ring-removed-background-color" />
      <ColorItem propName="--ring-warning-background-color" />
      <ColorItem propName="--ring-highlight-background-color" />
      <ColorItem propName="--ring-added-background-color" />
      <ColorItem propName="--ring-disabled-background-color" />
      <ColorItem propName="--ring-disabled-selected-background-color" />
      <ColorItem propName="--ring-button-danger-active-color" />
      <ColorItem propName="--ring-button-primary-background-color" />
      <ColorItem propName="--ring-table-loader-background-color" />
      <ColorItem propName="--ring-removed-subtle-background-color" />
      <ColorItem propName="--ring-warning-subtle-background-color" />
      <ColorItem propName="--ring-highlight-subtle-background-color" />
      <ColorItem propName="--ring-added-subtle-background-color" />
      <ColorItem propName="--ring-main-container-light-color" />
      <ColorItem propName="--ring-success-container-light-color" />
      <ColorItem propName="--ring-error-container-light-color" />
      <ColorItem propName="--ring-warning-container-light-color" />
      <ColorItem propName="--ring-highlight-container-light-color" />
      <ColorItem propName="--ring-highlight-fill-color" />
      <ColorItem propName="--ring-grey-container-light-color" />
      <ColorItem propName="--ring-grey-fill-color" />
      <ColorItem propName="--ring-grey-fill-accent-color" />
    </div>
  </div>
);

export const basic = () => (
  <div>
    <h2>Default theme</h2>
    {renderColors()}
  </div>
);

basic.storyName = 'Theme palette';

basic.parameters = {
  storyStyles: `
<style>
  .container {
    background-color: var(--ring-content-background-color);
    color: var(--ring-text-color);
    font-family: var(--ring-font-family);
  }

  .colors-group {
    display: flex;
    flex-wrap: wrap;
    font-family: var(--ring-font-family-monospace);
  }

  .color-square {
    width: calc(var(--ring-unit) * 4);
    height: calc(var(--ring-unit) * 4);
    border-radius: var(--ring-border-radius);
    border: 1px solid var(--ring-line-color);
  }

  .color-info {
    margin-left: var(--ring-unit);
  }

  .color-value {
    font-size: var(--ring-font-size-smaller);
    color: var(--ring-secondary-color);
  }

  .color-item {
    display: flex;
    flex-basis: 30%;
    padding: 4px var(--ring-unit);
    align-items: center;
  }
</style>
      `,
};

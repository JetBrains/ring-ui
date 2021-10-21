import darkVariables from '@jetbrains/ring-ui/components/global/variables_dark';

export default {
  title: 'Style-only/Theme palette',

  parameters: {
    notes: `
Ring UI colors are based on CSS custom properties spec. You can use them in you markup directly.
    `,
    hermione: {skip: true}
  }
};

function getDarkThemeStyle() {
  return Object.entries(darkVariables).
    map(([propName, val]) => `${propName}: ${val}`).
    join('; ');
}

function getValue(propName: string) {
  return getComputedStyle(document.body).getPropertyValue(propName).toUpperCase();
}

function renderColorItem(propName: string, isDark = propName.includes('-dark-')) {
  return `
    <div class="color-item ${isDark ? 'dark-background' : ''}">
      <div class="color-square" style="background-color: var(${propName})"></div>
      <div class="color-info">
        <div>${propName}</div>
        <div class="color-value">${getValue(propName)}</div>
      </div>
    </div>
  `;
}

const renderColors = () => `
  <div class="container">
    <h3>Element colors:</h3>
    <div class="colors-group">
      ${renderColorItem('--ring-line-color')}
      ${renderColorItem('--ring-borders-color')}
      ${renderColorItem('--ring-icon-color')}
      ${renderColorItem('--ring-icon-secondary-color')}
      ${renderColorItem('--ring-border-disabled-color')}
      ${renderColorItem('--ring-icon-disabled-color')}
      ${renderColorItem('--ring-border-hover-color')}
      ${renderColorItem('--ring-icon-hover-color')}
      ${renderColorItem('--ring-main-color')}
      ${renderColorItem('--ring-main-hover-color')}
      ${renderColorItem('--ring-icon-error-color')}
      ${renderColorItem('--ring-icon-warning-color')}
      ${renderColorItem('--ring-icon-success-color')}
      ${renderColorItem('--ring-pale-control-color')}
      ${renderColorItem('--ring-popup-border-color')}
      ${renderColorItem('--ring-popup-shadow-color')}
      ${renderColorItem('--ring-message-shadow-color')}
      ${renderColorItem('--ring-dark-line-color')}
      ${renderColorItem('--ring-dark-borders-color')}
      ${renderColorItem('--ring-dark-border-hover-color')}
    </div>

    <h3>Text colors:</h3>
    <div class="colors-group">
      ${renderColorItem('--ring-search-color')}
      ${renderColorItem('--ring-hint-color')}
      ${renderColorItem('--ring-link-color')}
      ${renderColorItem('--ring-link-hover-color')}
      ${renderColorItem('--ring-error-color')}
      ${renderColorItem('--ring-warning-color')}
      ${renderColorItem('--ring-success-color')}
      ${renderColorItem('--ring-text-color')}
      ${renderColorItem('--ring-heading-color')}
      ${renderColorItem('--ring-secondary-color')}
      ${renderColorItem('--ring-disabled-color')}
      ${renderColorItem('--ring-dark-secondary-color')}
      ${renderColorItem('--ring-dark-text-color')}
      ${renderColorItem('--ring-dark-disabled-color')}
      ${renderColorItem('--ring-dark-active-color')}
    </div>

    <h3>Background colors:</h3>
    <div class="colors-group">
      ${renderColorItem('--ring-content-background-color')}
      ${renderColorItem('--ring-popup-background-color')}
      ${renderColorItem('--ring-sidebar-background-color')}
      ${renderColorItem('--ring-selected-background-color')}
      ${renderColorItem('--ring-hover-background-color')}
      ${renderColorItem('--ring-message-background-color')}
      ${renderColorItem('--ring-navigation-background-color')}
      ${renderColorItem('--ring-removed-background-color')}
      ${renderColorItem('--ring-warning-background-color')}
      ${renderColorItem('--ring-added-background-color')}
      ${renderColorItem('--ring-tag-background-color')}
      ${renderColorItem('--ring-dark-selected-background-color')}
    </div>
  </div>
`;

export const basic = () => `
  <div>
    <h2>Default theme</h2>
    ${renderColors()}

    <div style="${getDarkThemeStyle()}">
      <h2>Dark theme</h2>
      ${renderColors()}
    </div>
  </div>
`;

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

  .dark-background {
    background-color: var(--ring-navigation-background-color);
    color: var(--ring-dark-text-color);
  }

  .color-square {
    width: calc(var(--ring-unit) * 4);
    height: calc(var(--ring-unit) * 4);
    border-radius: var(--ring-border-radius);
  }

  .color-info {
    margin-left: var(--ring-unit);
  }

  .color-value {
    font-size: var(--ring-font-size-smaller);
    color: var(--ring-secondary-color);
  }

  .dark-background .color-value {
    color: var(--ring-dark-secondary-color);
  }

  .color-item {
    display: flex;
    flex-basis: 30%;
    padding: 4px var(--ring-unit);
    align-items: center;
  }
</style>
      `
};

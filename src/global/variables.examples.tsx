import darkStyles from './variables_dark.css';
import getUID from './get-uid';

export default {
  title: 'Style-only/Theme palette',

  parameters: {
    notes: `
Ring UI colors are based on CSS custom properties spec. You can use them in you markup directly.
    `,
    hermione: {skip: true}
  }
};

function renderColorItem(propName: string) {
  const id = getUID('color-value-');
  return `
    <div class="color-item">
      <div class="color-square" style="background-color: var(${propName})"></div>
      <div class="color-info">
        <div>${propName}</div>
        <div class="color-value" id="${id}"></div>
        <script>
          {
            const formatColorPropertyValue = (value) => {
              if (value.indexOf('RGB(') > -1 && value.indexOf(')') > 0) {
                const rgbComponents = value.
                  substring(value.indexOf('RGB(') + 'RGB('.length, value.indexOf(')')).
                  split(',').
                  map((it) => {
                    try {
                      return Number.parseInt(it.trim(), 10);
                    } catch (err) {
                      return 0;
                    }
                  }).
                  map((it) => it.toString(16)).
                  map((it) => (it.length === 1 ? ('0' + it) : it)).
                  join('').toUpperCase();
                return '#' + rgbComponents + ' - ' + value;
              }
              return value;
            };

            const div = document.getElementById('${id}');
            const value = getComputedStyle(div).getPropertyValue('${propName}').toUpperCase();
            div.textContent = formatColorPropertyValue(value);
          }
        </script>
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
      ${renderColorItem('--ring-border-unselected-disabled-color')}
      ${renderColorItem('--ring-icon-disabled-color')}
      ${renderColorItem('--ring-border-hover-color')}
      ${renderColorItem('--ring-icon-hover-color')}
      ${renderColorItem('--ring-main-color')}
      ${renderColorItem('--ring-action-link-color')}
      ${renderColorItem('--ring-main-hover-color')}
      ${renderColorItem('--ring-action-link-hover-color')}
      ${renderColorItem('--ring-icon-error-color')}
      ${renderColorItem('--ring-icon-warning-color')}
      ${renderColorItem('--ring-icon-success-color')}
      ${renderColorItem('--ring-pale-control-color')}
      ${renderColorItem('--ring-popup-border-color')}
      ${renderColorItem('--ring-popup-shadow-color')}
      ${renderColorItem('--ring-message-shadow-color')}
      ${renderColorItem('--ring-button-danger-hover-color')}
      ${renderColorItem('--ring-button-primary-border-color')}
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
      ${renderColorItem('--ring-active-text-color')}
      ${renderColorItem('--ring-heading-color')}
      ${renderColorItem('--ring-secondary-color')}
      ${renderColorItem('--ring-disabled-color')}
      ${renderColorItem('--ring-white-text-color')}
    </div>

    <h3>Background colors:</h3>
    <div class="colors-group">
      ${renderColorItem('--ring-content-background-color')}
      ${renderColorItem('--ring-popup-background-color')}
      ${renderColorItem('--ring-sidebar-background-color')}
      ${renderColorItem('--ring-selected-background-color')}
      ${renderColorItem('--ring-hover-background-color')}
      ${renderColorItem('--ring-navigation-background-color')}
      ${renderColorItem('--ring-removed-background-color')}
      ${renderColorItem('--ring-warning-background-color')}
      ${renderColorItem('--ring-added-background-color')}
      ${renderColorItem('--ring-tag-background-color')}
      ${renderColorItem('--ring-tag-hover-background-color')}
      ${renderColorItem('--ring-disabled-background-color')}
      ${renderColorItem('--ring-disabled-selected-background-color')}
      ${renderColorItem('--ring-button-danger-active-color')}
      ${renderColorItem('--ring-button-loader-background')}
      ${renderColorItem('--ring-button-primary-background-color')}
    </div>
  </div>
`;

export const basic = () => `
  <div>
    <h2>Default theme</h2>
    ${renderColors()}

    <div class="${darkStyles.dark}">
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

  .color-item {
    display: flex;
    flex-basis: 30%;
    padding: 4px var(--ring-unit);
    align-items: center;
  }
</style>
      `
};

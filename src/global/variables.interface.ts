import type {Property} from 'csstype';

export interface RingCSSProperties {
  '--ring-unit'?: string;

  /* Element */
  '--ring-line-color'?: Property.BorderColor;
  '--ring-borders-color'?: Property.BorderColor;
  '--ring-icon-color'?: Property.Color;
  '--ring-icon-secondary-color'?: Property.Color;
  '--ring-border-disabled-color'?: Property.BorderColor;
  '--ring-icon-disabled-color'?: Property.Color;
  '--ring-border-hover-color'?: Property.BorderColor;
  '--ring-icon-hover-color'?: Property.Color;
  '--ring-main-color'?: Property.Color;
  '--ring-main-hover-color'?: Property.Color;
  '--ring-icon-error-color'?: Property.Color;
  '--ring-icon-warning-color'?: Property.Color;
  '--ring-icon-success-color'?: Property.Color;
  '--ring-pale-control-color'?: Property.Color;
  '--ring-popup-border-components'?: string;
  '--ring-popup-border-color'?: Property.BorderColor;
  '--ring-popup-shadow-color'?: Property.Color;
  '--ring-message-shadow-color'?: Property.Color;
  '--ring-pinned-shadow-color'?: Property.Color;
  '--ring-button-danger-hover-color'?: Property.Color;
  '--ring-button-primary-border-color'?: Property.Color;

  /* Text */
  '--ring-search-color'?: Property.Color;
  '--ring-hint-color'?: Property.Color;
  '--ring-link-color'?: Property.Color;
  '--ring-link-hover-color'?: Property.Color;
  '--ring-error-color'?: Property.Color;
  '--ring-warning-color'?: Property.Color;
  '--ring-success-color'?: Property.Color;
  '--ring-text-color'?: Property.Color;
  '--ring-active-text-color'?: Property.Color;
  '--ring-white-text-color'?: Property.Color;
  '--ring-heading-color'?: Property.Color;
  '--ring-secondary-color'?: Property.Color;
  '--ring-disabled-color'?: Property.Color;

  /* Background */
  '--ring-content-background-color'?: Property.BackgroundColor;
  '--ring-popup-background-color'?: Property.BackgroundColor;
  '--ring-sidebar-background-color'?: Property.BackgroundColor;
  '--ring-selected-background-color'?: Property.BackgroundColor;
  '--ring-hover-background-color'?: Property.BackgroundColor;
  '--ring-navigation-background-color'?: Property.BackgroundColor;
  '--ring-tag-background-color'?: Property.BackgroundColor;
  '--ring-tag-hover-background-color'?: Property.BackgroundColor;
  '--ring-removed-background-color'?: Property.BackgroundColor;
  '--ring-warning-background-color'?: Property.BackgroundColor;
  '--ring-added-background-color'?: Property.BackgroundColor;
  '--ring-disabled-background-color'?: Property.BackgroundColor;
  '--ring-disabled-selected-background-color'?: Property.BackgroundColor;
  '--ring-button-danger-active-color'?: Property.BackgroundColor;
  '--ring-button-loader-background'?: Property.BackgroundColor;
  '--ring-button-primary-background-color'?: Property.BackgroundColor;

  /* Code */
  '--ring-code-background-color'?: Property.BackgroundColor;
  '--ring-code-color'?: Property.Color;
  '--ring-code-comment-color'?: Property.Color;
  '--ring-code-meta-color'?: Property.Color;
  '--ring-code-keyword-color'?: Property.Color;
  '--ring-code-tag-background-color'?: Property.BackgroundColor;
  '--ring-code-tag-color'?: Property.Color;
  '--ring-code-tag-font-weight'?: Property.FontWeight;
  '--ring-code-field-color'?: Property.Color;
  '--ring-code-attribute-color'?: Property.Color;
  '--ring-code-number-color'?: Property.Color;
  '--ring-code-string-color'?: Property.Color;
  '--ring-code-addition-color'?: Property.Color;
  '--ring-code-deletion-color'?: Property.Color;

  /* Metrics */
  '--ring-border-radius'?: Property.BorderRadius;
  '--ring-border-radius-small'?: Property.BorderRadius;
  '--ring-font-size-larger'?: Property.FontSize;
  '--ring-font-size'?: Property.FontSize;
  '--ring-font-size-smaller'?: Property.FontSize;
  '--ring-line-height-taller'?: Property.LineHeight;
  '--ring-line-height'?: Property.LineHeight;
  '--ring-line-height-lower'?: Property.LineHeight;
  '--ring-line-height-lowest'?: Property.LineHeight;
  '--ring-ease'?: string;
  '--ring-fast-ease'?: string;
  '--ring-font-family'?: Property.FontFamily;
  '--ring-font-family-monospace'?: Property.FontFamily;

  /* Common z-index-values */

  /* Invisible element is an absolutely positioned element which should be below */
  /* all other elements on the page */
  '--ring-invisible-element-z-index'?: Property.ZIndex;

  /* z-index for position?: fixed elements */
  '--ring-fixed-z-index'?: Property.ZIndex;

  /* Elements that should overlay all other elements on the page */
  '--ring-overlay-z-index'?: Property.ZIndex;

  /* Alerts should de displayed above overlays */
  '--ring-alert-z-index'?: Property.ZIndex;
}

declare module 'csstype' {
  interface Properties extends RingCSSProperties {}
}

# Page layouts

Ring UI supplies controls, surfaces, and tokens. It does not replace page geometry: semantic HTML defines the document, while native CSS Grid/Flexbox defines the shell, widths, responsive behavior, sticky regions, and scroll ownership.

The examples and consumer imports use `@jetbrains/ring-ui-built`.

## Contents

- [App setup](#app-setup)
- [Complete page shell](#complete-page-shell)
- [Geometry rules](#geometry-rules)
- [Sticky offsets and nested scopes](#sticky-offsets-and-nested-scopes)
- [Theme, semantics, and accessibility](#theme-semantics-and-accessibility)

## App setup

Use the repository's package manager to install the built package. For example, with npm:

```shell
npm install @jetbrains/ring-ui-built
```

Import the consolidated stylesheet exactly once at the application entry point. Import components from the same package, and put `ThemeProvider` near the application root with `Theme.AUTO` and `passToPopups`:

```tsx
import {createRoot} from 'react-dom/client';
import '@jetbrains/ring-ui-built/components/style.css';
import Theme, {ThemeProvider} from '@jetbrains/ring-ui-built/components/global/theme';

import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

const root = createRoot(rootElement);

root.render(
  <ThemeProvider theme={Theme.AUTO} passToPopups target={document.body}>
    <App />
  </ThemeProvider>,
);
```

Add `class="plugin"` to `<body>`:

```html
<body class="plugin">
  <div id="root"></div>
</body>
```

Add the baseline page styles to application CSS:

```css
body.plugin {
  padding: 0 16px;
  background-color: var(--ring-content-background-color);
  color: var(--ring-text-color);
  font-size: var(--ring-font-size);
}
```

A deliberately full-bleed shell can override the body padding in application CSS.

## Complete page shell

`page-shell.tsx`:

```tsx
import type {ReactNode} from 'react';
import Button from '@jetbrains/ring-ui-built/components/button/button';
import {H1} from '@jetbrains/ring-ui-built/components/heading/heading';

import styles from './page-shell.module.css';

type PageShellProps = {
  children: ReactNode;
  currentPath: string;
  onCreateProject: () => void;
};

const primaryNavigation = [
  {href: '/projects', label: 'Projects'},
  {href: '/teams', label: 'Teams'},
];

const settingsNavigation = [
  {href: '/projects/settings/general', label: 'General'},
  {href: '/projects/settings/access', label: 'Access'},
  {href: '/projects/settings/integrations', label: 'Integrations'},
];

export function PageShell({children, currentPath, onCreateProject}: PageShellProps) {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        Skip to content
      </a>

      <header className={styles.topBar}>
        <a className={styles.brand} href="/" aria-label="Acme home">
          Acme
        </a>
        <nav className={styles.topNavigation} aria-label="Primary">
          {primaryNavigation.map(item => (
            <a
              key={item.href}
              className={styles.navigationLink}
              href={item.href}
              aria-current={currentPath === item.href ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Button primary onClick={onCreateProject}>
          New project
        </Button>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.sidebar}>
          <nav className={styles.sidebarNavigation} aria-label="Project settings">
            {settingsNavigation.map(item => (
              <a
                key={item.href}
                className={styles.sidebarLink}
                href={item.href}
                aria-current={currentPath === item.href ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main id="main-content" className={styles.main} tabIndex={-1}>
          <div className={styles.content}>
            <H1>Project settings</H1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
```

`page-shell.module.css`:

```css
.shell {
  --page-top-offset: calc(var(--ring-unit) * 8);

  min-height: 100dvh;
  color: var(--ring-text-color);
  background: var(--ring-content-background-color);
}

.skipLink {
  position: absolute;
  z-index: 20;
  inset-block-start: var(--ring-unit);
  inset-inline-start: var(--ring-unit);
  padding: var(--ring-unit) calc(var(--ring-unit) * 2);
  color: var(--ring-link-color);
  background: var(--ring-content-background-color);
  border: 1px solid var(--ring-borders-color);
  transform: translateY(-200%);
}

.skipLink:focus {
  transform: none;
}

.topBar {
  position: sticky;
  z-index: 10;
  inset-block-start: 0;
  display: flex;
  min-height: var(--page-top-offset);
  align-items: center;
  gap: calc(var(--ring-unit) * 2);
  padding-inline: calc(var(--ring-unit) * 4);
  background: var(--ring-navigation-background-color);
  border-block-end: 1px solid var(--ring-line-color);
}

.brand {
  flex: none;
  color: var(--ring-text-color);
  font-weight: bold;
  text-decoration: none;
}

.topNavigation {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: var(--ring-unit) calc(var(--ring-unit) * 2);
  min-width: 0;
}

.navigationLink,
.sidebarLink {
  color: var(--ring-link-color);
}

.navigationLink[aria-current='page'],
.sidebarLink[aria-current='page'] {
  color: var(--ring-text-color);
  font-weight: bold;
  text-decoration: none;
}

.workspace {
  display: grid;
  grid-template-columns: calc(var(--ring-unit) * 30) minmax(0, 1fr);
  min-height: calc(100dvh - var(--page-top-offset));
}

.sidebar {
  position: sticky;
  inset-block-start: var(--page-top-offset);
  align-self: start;
  padding: calc(var(--ring-unit) * 3);
  background: var(--ring-sidebar-background-color);
  border-inline-end: 1px solid var(--ring-line-color);
}

.sidebarNavigation {
  display: flex;
  flex-direction: column;
  gap: var(--ring-unit);
}

.main {
  min-width: 0;
  padding: calc(var(--ring-unit) * 4);
}

.content {
  width: min(100%, calc(var(--ring-unit) * 120));
  margin-inline: auto;
}

@media (max-width: 760px) {
  .shell {
    --page-top-offset: 0px;
  }

  .topBar {
    position: static;
    flex-wrap: wrap;
    padding: calc(var(--ring-unit) * 2);
  }

  .topNavigation {
    order: 3;
    flex-basis: 100%;
  }

  .workspace {
    grid-template-columns: minmax(0, 1fr);
    min-height: 0;
  }

  .sidebar {
    position: static;
    min-width: 0;
    padding: var(--ring-unit) calc(var(--ring-unit) * 2);
    overflow-x: auto;
    border-inline-end: 0;
    border-block-end: 1px solid var(--ring-line-color);
  }

  .sidebarNavigation {
    width: max-content;
    flex-direction: row;
    gap: calc(var(--ring-unit) * 2);
  }

  .main {
    padding: calc(var(--ring-unit) * 2);
  }
}
```

## Geometry rules

- Use `--ring-unit` as the spacing base and semantic tokens such as `--ring-content-background-color`, `--ring-sidebar-background-color`, `--ring-text-color`, and `--ring-line-color`. Do not paste their current pixel or color values into application CSS.
- In Grid/Flexbox, `min-width: auto` can stop content from shrinking and `min-height: auto` can stop vertical children from scrolling. Put `min-width: 0` or `min-height: 0` on the child that must shrink.
- Assign exactly one scroll owner per axis and scope. Prefer document scrolling for a page; use a named inner owner only for a deliberate viewport-like region. The mobile sidebar above owns only its horizontal overflow. A dialog or portal is a separate scroll scope.
- Bound long-form reading content rather than stretching it across the viewport. Choose a product-appropriate token-multiple maximum; allow tables, canvases, and dense dashboards to use a wider explicit region.
- Use CSS media queries when only geometry changes. Branch in React when narrow layouts need different interaction, focus order, or content—not to reproduce `display`, wrapping, or column changes.
- Use container queries for reusable widgets whose layout depends on their allocated panel width. Give the wrapper `container-type: inline-size` and keep viewport queries for the outer application shell.

## Sticky offsets and nested scopes

Prefer a simple inherited CSS variable when sticky heights are known:

```css
.page {
  --sticky-offset: calc(var(--ring-unit) * 8);
}

.localToolbar {
  position: sticky;
  inset-block-start: var(--sticky-offset);
}
```

Measure in JavaScript only when the preceding sticky height is genuinely dynamic; publish the measured value as a CSS variable instead of calculating every child position in React. Keep portal and dialog scroll containers isolated: their sticky offsets begin at that scope's top, not the document header.

## Theme, semantics, and accessibility

- Put `ThemeProvider` near the application root and use `Theme.AUTO`; use `passToPopups` when popup content must inherit the theme. Keep token-based application CSS inside the same themed subtree.
- Keep one real `h1` in `main`. Use `header`, labelled `nav`, `aside`, and `main` landmarks; do not use visual heading styles as a substitute for heading order.
- Use native anchors for navigation so open-in-new-tab, copy-link, and browser history continue to work. Use buttons for actions.
- Preserve visible focus, keyboard order, skip navigation, accessible names, and `aria-current="page"`. Ensure sticky content does not obscure focused targets or anchor destinations; use `scroll-margin-block-start` where needed.

Avoid deprecated `Grid`/`Row`/`Col` and `ContentLayout`, hardcoded copies of token values, fixed positioning where sticky works, JavaScript viewport checks for pure layout, styling Ring internals or `data-test`, and product-specific frameworks or portal conventions.

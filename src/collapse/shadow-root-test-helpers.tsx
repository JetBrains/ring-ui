import {type FC, type PropsWithChildren, StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

export const createShadowRootStyleSheet = (ruleTitles: string[], ruleCount?: number) => {
  const ruleCountLocal = ruleCount ?? ruleTitles.length;

  for (const styleSheet of document.styleSheets) {
    if (styleSheet.cssRules.length === ruleCountLocal) {
      const matchesArr = ruleTitles.map((rule, i) => Boolean(styleSheet.cssRules.item(i)?.cssText.includes(rule)));

      if (!matchesArr.includes(false)) {
        const newStyleSheet = new CSSStyleSheet();
        for (const cssRule of styleSheet.cssRules) {
          newStyleSheet.insertRule(cssRule.cssText);
        }
        return newStyleSheet;
      }
    }
  }

  throw new Error('Was unable to match any stylesheets for Collapse component');
};

export const ShadowRootWrap: FC<PropsWithChildren<{adoptedStyleSheets?: CSSStyleSheet[]}>> = ({
  children,
  adoptedStyleSheets,
}) => {
  const refCb = (shadowRootParent: HTMLDivElement) => {
    let shadowRoot;
    if (shadowRootParent.shadowRoot) {
      shadowRoot = shadowRootParent.shadowRoot;
    } else {
      shadowRoot = shadowRootParent.attachShadow({
        mode: 'open',
      });
      if (adoptedStyleSheets) {
        shadowRoot.adoptedStyleSheets = adoptedStyleSheets;
      }
    }

    const rootElem = document.createElement('div');
    shadowRoot.replaceChildren(rootElem);

    const rootComponent = createRoot(rootElem);

    rootComponent.render(<StrictMode>{children}</StrictMode>);

    return () => {
      queueMicrotask(() => {
        rootComponent.unmount();
      });
    };
  };

  return <div ref={refCb} />;
};

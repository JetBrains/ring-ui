/**
 * Extracts the base component name (slug) from a Storybook file path.
 *
 * Example: getSlugFromPath('/src/button/button.stories.tsx') → 'button'
 */
export const getSlugFromPath = (path: string) =>
  (path.split(/[/\\]/).pop() ?? '').replace(/\.(stories|story)\.[^.]+$/i, '');

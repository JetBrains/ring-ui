import {Source, useOf} from '@storybook/addon-docs/blocks';

import {getSlugFromPath} from './utils';

export const Import = () => {
  const {preparedMeta} = useOf('meta', ['meta']);
  const exportName = preparedMeta?.component?.displayName ?? preparedMeta?.component?.name;
  const slug = getSlugFromPath(preparedMeta?.parameters?.fileName || '');

  if (!slug || !exportName) {
    return null;
  }

  const builtPath = `import ${exportName} from '@jetbrains/ring-ui-built/components/${slug}/${slug}';`;
  const sourcePath = `import ${exportName} from '@jetbrains/ring-ui/components/${slug}/${slug}';`;

  return (
    <>
      <h3>{'Import'}</h3>

      <p>{'Quick start (ready-to-use ES modules):'}</p>
      <Source language='tsx' code={builtPath} />

      <p>{'Build from sources (webpack):'}</p>
      <Source language='tsx' code={sourcePath} />
    </>
  );
};

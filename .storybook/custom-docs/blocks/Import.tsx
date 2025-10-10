import {Source, useOf} from '@storybook/addon-docs/blocks';

interface DocsParams {
  componentSlug?: string;
}

interface Prepared {
  parameters?: {docs?: DocsParams};
  component?: {displayName?: string; name?: string};
  title?: string;
}

export const Import = () => {
  const {preparedMeta} = useOf('meta', ['meta']) as {preparedMeta?: Prepared};
  const slug = preparedMeta?.parameters?.docs?.componentSlug;
  const exportName = preparedMeta?.component?.displayName ?? preparedMeta?.component?.name;

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

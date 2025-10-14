import {Source, useOf} from '@storybook/addon-docs/blocks';

interface DocsParameters {
  importSubpath?: string;
  exportName?: string;
}

interface PreparedMeta {
  parameters?: {docs?: DocsParameters};
}

export const Import = () => {
  const {preparedMeta} = useOf('meta', ['meta']) as {preparedMeta: PreparedMeta};
  const exportName = preparedMeta.parameters?.docs?.exportName;
  const importSubpath = preparedMeta.parameters?.docs?.importSubpath;

  if (!exportName || !importSubpath) {
    return null;
  }

  const builtPath = `import ${exportName} from '@jetbrains/ring-ui-built/${importSubpath}';`;
  const sourcePath = `import ${exportName} from '@jetbrains/ring-ui/${importSubpath}';`;

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

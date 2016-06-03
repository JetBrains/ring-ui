const components = require.context('../components', true, /\/([^\.])\/\1\.js$/);

components.keys().forEach(components);

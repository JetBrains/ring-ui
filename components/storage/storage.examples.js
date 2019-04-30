import {storiesOf} from '@storybook/html';

import Storage from './storage';

storiesOf('Components|Storage', module).
  addParameters({hermione: {skip: true}}).
  add('basic', () => {
    const STORAGE_KEY = 'storage-example-key';
    const storage = new Storage();
    const node = document.createElement('div');

    let value;

    async function init() {
      const storedValue = await storage.get(STORAGE_KEY);
      if (!storedValue) {
        const generatedValue = Math.random().toString();
        await storage.set(STORAGE_KEY, generatedValue);
        value = generatedValue;
      } else {
        value = storedValue;
      }

      node.innerText = `Stored value = ${value}`;
    }

    init();

    return node;
  });

import Storage from '@jetbrains/ring-ui/components/storage/storage';

export default {
  title: 'Components/Storage',

  parameters: {
    notes: 'Provides a façade to localStorage/sessionStorage/cookies.',
    hermione: {skip: true}
  }
};

export const basic = () => {
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
};

basic.storyName = 'Storage';

import {useEffect, useState} from 'react';

import Storage from './storage';

export default {
  title: 'Components/Storage',

  parameters: {
    notes: 'Provides a façade to localStorage/sessionStorage/cookies.',
    screenshots: {skip: true}
  }
};

export const Basic = () => {
  const [text, setText] = useState('');
  useEffect(() => {
    const STORAGE_KEY = 'storage-example-key';
    const storage = new Storage();

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

      setText(`Stored value = ${value}`);
    }

    init();
  }, []);

  return <div>{text}</div>;
};

Basic.storyName = 'Storage';

import {useEffect, useRef} from 'react';

import Link from '../link/link';
import Input from '../input/input';
import Caret from './caret';

export default {
  title: 'Utilities/Caret',

  parameters: {
    notes:
      'Allows manipulation of the caret position in a text box or a contenteditable element. Ported from [jquery-caret](https://github.com/accursoft/caret/).',
    screenshots: {skip: true},
  },
};

export const Basic = () => {
  const input = useRef<HTMLTextAreaElement>(null);
  const caret = useRef<Caret>(null);
  useEffect(() => {
    if (input.current) {
      caret.current = new Caret(input.current);
    }
  }, []);

  return (
    <>
      <Input
        multiline
        inputRef={input}
        label='Textarea'
        defaultValue={`Lorem ipsum
dolor sit amet`}
      />
      <div>
        <Link
          pseudo
          onClick={event => {
            caret.current?.focus();
            caret.current?.setPosition(4);
            event.preventDefault();
          }}
        >
          Set caret position
        </Link>
      </div>
    </>
  );
};

Basic.storyName = 'Caret';

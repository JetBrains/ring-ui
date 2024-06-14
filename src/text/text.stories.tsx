import Group from '../group/group';

import Text from './text';

export default {
  title: 'Components/Text',

  parameters: {
    notes: 'A component for rendering text content.'
  }
};

export const basic = () => (
  <div>
    <p style={{fontSize: '30px'}}>
      <Group>
        <Text>Text, which size is set by the outer style</Text>
        <Text info>with an info message</Text>
      </Group>
    </p>

    <p style={{fontSize: '30px'}}>
      <Group>
        <Text size={Text.Size.S}>Small text</Text>
        <Text size={Text.Size.S} info>with an info message</Text>
      </Group>
    </p>

    <p style={{fontSize: '30px'}}>
      <Group>
        <Text size={Text.Size.M}>Medium text</Text>
        <Text size={Text.Size.M} info>with an info message</Text>
      </Group>
    </p>

    <p style={{fontSize: '30px'}}>
      <Group>
        <Text size={Text.Size.L}>Large text</Text>
        <Text size={Text.Size.L} info>with an info message</Text>
      </Group>
    </p>
  </div>
);

basic.storyName = 'Text';

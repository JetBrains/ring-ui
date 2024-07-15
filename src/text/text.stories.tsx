import Text from './text';

export default {
  title: 'Components/Text',

  parameters: {
    notes: 'A component for rendering text content.'
  }
};

export const basic = () => (
  <div>
    <p>
      <Text size={Text.Size.S} info>Label text example</Text>
      <br/>
      <Text size={Text.Size.S} info bold>Label text example bold</Text>
    </p>

    <p>
      <Text size={Text.Size.M}>Regular text example</Text>
      <br/>
      <Text size={Text.Size.M} bold>Regular text example bold</Text>
    </p>

    <p>
      <Text size={Text.Size.L}>Text block example</Text>
      <br/>
      <Text size={Text.Size.L} bold>Text block example bold</Text>
    </p>
  </div>
);

basic.storyName = 'Text';

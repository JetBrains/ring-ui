import Toggle, {Size} from './toggle';

export default {
  title: 'Components/Toggle',

  parameters: {
    notes: 'Displays a checkbox as an animated on/off toggle.',
  },
};

export const basic = () => (
  <div>
    <h1>Size 14</h1>
    <div>
      <Toggle size={Size.Size14}>Unchecked by default</Toggle>
    </div>
    <div>
      <Toggle size={Size.Size14} defaultChecked>
        Checked by default
      </Toggle>
    </div>
    <div>
      <Toggle size={Size.Size14} disabled>
        Disabled unchecked
      </Toggle>
    </div>
    <div>
      <Toggle size={Size.Size14} disabled defaultChecked>
        Disabled checked
      </Toggle>
    </div>
    <div>
      <Toggle size={Size.Size14} leftLabel='With label on the left' />
    </div>
    <div>
      <Toggle size={Size.Size14} help='Help text'>
        With help text
      </Toggle>
    </div>
    <div>
      <Toggle size={Size.Size14} help='Help text' disabled>
        With help text disabled
      </Toggle>
    </div>
    <h1>Size 16 (default)</h1>
    <div>
      <Toggle>Unchecked by default</Toggle>
    </div>
    <div>
      <Toggle defaultChecked>Checked by default</Toggle>
    </div>
    <div>
      <Toggle disabled>Disabled unchecked</Toggle>
    </div>
    <div>
      <Toggle disabled defaultChecked>
        Disabled checked
      </Toggle>
    </div>
    <div>
      <Toggle leftLabel='With label on the left' />
    </div>
    <div>
      <Toggle help='Help text'>With help text</Toggle>
    </div>
    <div>
      <Toggle help='Help text' disabled>
        With help text disabled
      </Toggle>
    </div>
    <h1>Size 20</h1>
    <div style={{lineHeight: '24px'}}>
      <div>
        <Toggle size={Size.Size20}>Unchecked by default</Toggle>
      </div>
      <div>
        <Toggle size={Size.Size20} defaultChecked>
          Checked by default
        </Toggle>
      </div>
      <div>
        <Toggle size={Size.Size20} disabled>
          Disabled unchecked
        </Toggle>
      </div>
      <div>
        <Toggle size={Size.Size20} disabled defaultChecked>
          Disabled checked
        </Toggle>
      </div>
      <div>
        <Toggle size={Size.Size20} leftLabel='With label on the left' />
      </div>
      <div>
        <Toggle size={Size.Size20} help='Help text'>
          With help text
        </Toggle>
      </div>
      <div>
        <Toggle size={Size.Size20} help='Help text' disabled>
          With help text disabled
        </Toggle>
      </div>
    </div>
  </div>
);

basic.storyName = 'Toggle';

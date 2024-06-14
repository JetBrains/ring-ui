import Toggle, {Size} from './toggle';

export default {
  title: 'Components/Toggle',

  parameters: {
    notes: 'Displays a checkbox as an animated on/off toggle.',
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc7012b7bdaa2dae6aa9'
  }
};

export const basic = () => (
  <div>
    <h1>Size 14</h1>
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
      <Toggle disabled defaultChecked>Disabled checked</Toggle>
    </div>
    <div>
      <Toggle pale>Pale unchecked by default</Toggle>
    </div>
    <div>
      <Toggle pale defaultChecked>Pale checked by default</Toggle>
    </div>
    <div>
      <Toggle pale disabled>Pale disabled unchecked</Toggle>
    </div>
    <div>
      <Toggle pale disabled defaultChecked>Pale disabled checked</Toggle>
    </div>
    <div>
      <Toggle leftLabel="With label on the left"/>
    </div>
    <h1>Size 16</h1>
    <div>
      <Toggle size={Size.Size16}>Unchecked by default</Toggle>
    </div>
    <div>
      <Toggle size={Size.Size16} defaultChecked>Checked by default</Toggle>
    </div>
    <div>
      <Toggle size={Size.Size16} disabled>Disabled unchecked</Toggle>
    </div>
    <div>
      <Toggle size={Size.Size16} disabled defaultChecked>Disabled checked</Toggle>
    </div>
    <div>
      <Toggle size={Size.Size16} pale>Pale unchecked by default</Toggle>
    </div>
    <div>
      <Toggle size={Size.Size16} pale defaultChecked>Pale checked by default</Toggle>
    </div>
    <div>
      <Toggle size={Size.Size16} pale disabled>Pale disabled unchecked</Toggle>
    </div>
    <div>
      <Toggle size={Size.Size16} pale disabled defaultChecked>Pale disabled checked</Toggle>
    </div>
    <div>
      <Toggle size={Size.Size16} leftLabel="With label on the left"/>
    </div>
    <h1>Size 20</h1>
    <div style={{lineHeight: '24px'}}>
      <div>
        <Toggle size={Size.Size20}>Unchecked by default</Toggle>
      </div>
      <div>
        <Toggle size={Size.Size20} defaultChecked>Checked by default</Toggle>
      </div>
      <div>
        <Toggle size={Size.Size20} disabled>Disabled unchecked</Toggle>
      </div>
      <div>
        <Toggle size={Size.Size20} disabled defaultChecked>Disabled checked</Toggle>
      </div>
      <div>
        <Toggle size={Size.Size20} pale>Pale unchecked by default</Toggle>
      </div>
      <div>
        <Toggle size={Size.Size20} pale defaultChecked>Pale checked by default</Toggle>
      </div>
      <div>
        <Toggle size={Size.Size20} pale disabled>Pale disabled unchecked</Toggle>
      </div>
      <div>
        <Toggle size={Size.Size20} pale disabled defaultChecked>Pale disabled checked</Toggle>
      </div>
      <div>
        <Toggle size={Size.Size20} leftLabel="With label on the left"/>
      </div>
    </div>
  </div>
);

basic.storyName = 'Toggle';

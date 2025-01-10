import Avatar, {Size} from './avatar';
import {avatarDataUri} from './avatar-example-datauri';

export default {
  title: 'Components/Avatar',

  parameters: {
    notes: 'Displays an avatar. In case of a loading error an empty square is displayed.',
  },
};

export const avatar = () => {
  function Example() {
    return (
      <div>
        {[Size.Size20, Size.Size24, Size.Size28, Size.Size32, Size.Size40, Size.Size56].map(size => (
          <div className="avatar-demo" key={size}>
            <Avatar size={size} url={avatarDataUri} />
            <Avatar size={size} username="Jet Brains" />
            <Avatar size={size} username="👹🙀" />
            <Avatar size={size} username="Jet Brains" round />
            <Avatar size={size} />
          </div>
        ))}
      </div>
    );
  }

  return <Example />;
};

avatar.parameters = {
  storyStyles: `
<style>
  .avatar-demo {
    display: flex;
    justify-content: space-between;
    width: 320px;
    margin-bottom: 16px;
  }
</style>`,
};

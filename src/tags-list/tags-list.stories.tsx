import checkmarkIcon from '@jetbrains/icons/checkmark';

import TagsList from './tags-list';

export default {
  title: 'Components/Tags List',

  parameters: {
    notes: 'Displays a list of tags.',
  },
};

export const basic = () => (
  <TagsList
    className="test-additional-class"
    tags={[
      {key: 'test1', label: 'test1'},
      {key: 'test2', label: 'test2'},
    ]}
  />
);

basic.storyName = 'basic';

export const withIcons = () => (
  <TagsList
    tags={[
      {key: 'test1', label: 'test1', rgTagIcon: checkmarkIcon},
      {key: 'test2', label: 'test2'},
    ]}
  />
);

withIcons.storyName = 'with icons';

export const disabled = () => (
  <TagsList
    disabled
    tags={[
      {key: 'test1', label: 'test1'},
      {key: 'test2', label: 'test2'},
    ]}
  />
);

disabled.storyName = 'disabled';
